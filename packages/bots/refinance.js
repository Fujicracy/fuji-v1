require('dotenv').config();

const fs = require("fs");
const chalk = require("chalk");
const { ethers, Wallet } = require('ethers');
const { loadContracts, getGasPrice } = require('./utils');

const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER_URL);
let signer;
if (process.env.PRIVATE_KEY) {
  signer = new Wallet(process.env.PRIVATE_KEY, provider);
}
else {
  throw new Error('PRIVATE_KEY not set: please, set it in ".env"!');
}

const vaultsList = [
  'VaultETHDAI',
  'VaultETHUSDC',
];
const DAI_ADDR = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const USDC_ADDR = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

async function getLiquidationProviderIndex(vault, contracts) {
  const providerIndex = {
    aave: 0,
    dydx: 1,
    compound: 2
  };
  const { borrowAsset } = await vault.vAssets();
  const activeProvider = await vault.activeProvider();
  const dydxProviderAddr = contracts.ProviderDYDX.address;

  if ([DAI_ADDR, USDC_ADDR].includes(borrowAsset) && activeProvider !== dydxProviderAddr) {
    // use dydx flashloans when underlying asset is DAI or USDC and
    // current activeProvider is not dYdX
    return providerIndex.dydx;
  }
  return providerIndex.compound;
}

function getProviderName(providerAddr, contracts) {
  const dydxProviderAddr = contracts.ProviderDYDX.address;
  const aaveProviderAddr = contracts.ProviderAave.address;
  const compoundProviderAddr = contracts.ProviderCompound.address;

  if (providerAddr === dydxProviderAddr) {
    return 'ProviderDYDX';
  } else if (providerAddr === aaveProviderAddr) {
    return 'ProviderAave';
  } else if (providerAddr === compoundProviderAddr) {
    return 'ProviderCompound';
  }
}

async function switchProviders(contracts, vault, newProviderAddr) {
  const index = await getLiquidationProviderIndex(vault, contracts);
  const gasPrice = await getGasPrice();
  const _gasLimit = await contracts.Controller
    .estimateGas
    .doRefinancing(vault.address, newProviderAddr, 1, 1, index, { gasPrice });
  // increase by 10%
  const gasLimit = gasLimit.add(_gasLimit.div(BigNumber.from('10')));

  return await contracts.Controller.connect(signer)
    .doRefinancing(
      vault.address,
      newProviderAddr,
      1,
      1,
      index,
      { gasPrice, gasLimit }
    );
}

async function shouldChange(currentRate, newRate, lastSwitch) {
  // current provider is still the best
  if (!newRate) {
    return false;
  }
  const BLOCKS_IN_HOUR = 269; // approx.
  // change when difference in APRs is more than 4%
  const APR_THRESHOLD = ethers.utils.parseUnits("4", 25);

  const currentBlockNumber = await provider.getBlockNumber();
  const timeCheck = !lastSwitch
    ? true // first switch
    // check if last switch was at least 1h ago
    : currentBlockNumber - lastSwitch.blockNumber > BLOCKS_IN_HOUR;
  
  return currentRate.sub(newRate).gte(APR_THRESHOLD) && timeCheck;
}

async function checkRates(vaultName, contracts) {
  console.log('Checking', chalk.yellow(`${vaultName} ...`));
  const vault = contracts[vaultName];
  const { borrowAsset } = await vault.vAssets();
  const activeProviderAddr = await vault.activeProvider();
  
  const activeProviderName = getProviderName(activeProviderAddr, contracts);

  const currentRate = await contracts[activeProviderName]
    .getBorrowRateFor(borrowAsset);

  const providers = await vault.getProviders();

  let bestRate = currentRate;
  let bestProviderIndex;
  for (let i = 0; i < providers.length; i++) {
    const providerName = getProviderName(providers[i], contracts);
    const rate = await contracts[providerName].getBorrowRateFor(borrowAsset);

    // determine provider with best rate
    if (rate.lt(bestRate)) {
      bestRate = rate;
      bestProviderIndex = i;
    }
  }

  const filterSwitches = vault.filters.Switch();
  // Filter all Switch events
  const events = await vault.queryFilter(filterSwitches);
  const lastSwitch = events[events.length - 1];
  const toChange = await shouldChange(currentRate, bestRate, lastSwitch);

  if (toChange) {
    console.log(`-> proceed to swtich activeProvider of ${vaultName}`);
    await switchProviders(contracts, vault, providers[bestProviderIndex])
      .then(_ => console.log(chalk.blue(`---> successfully switched provider of ${vaultName}`)))
      .catch(e => console.log(e));
  }
  else {
    console.log(chalk.cyan('-> not due for refinance'));
  }
}

async function checkForRefinance(contracts) {
  for (let v = 0; v < vaultsList.length; v++) {
    const vaultName = vaultsList[v];
    await checkRates(vaultName, contracts);
  }
}

async function main() {
  console.log('Start checking for refinancing...');

  const contracts = await loadContracts(signer);
  await checkForRefinance(contracts);

  // run every 10 min
  setInterval(async () => await checkForRefinance(contracts), 10 * 60 * 1000);
}

main();
