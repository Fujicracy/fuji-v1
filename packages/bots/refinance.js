require('dotenv').config();

const fs = require("fs");
const { ethers, Wallet, Signer } = require('ethers');
const { loadContracts } = require('./utils');

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
const DAI_ADDR = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

async function getLiquidationProviderIndex(vault, contracts) {
  const providerIndex = {
    'aave': '0',
    'dydx': '1',
  };
  const { borrowAsset } = await vault.vAssets();
  const activeProvider = await vault.activeProvider();
  const dydxProviderAddr = contracts.ProviderDYDX.address;

  if ([DAI_ADDR, USDC_ADDR].includes(borrowAsset) && activeProvider !== dydxProviderAddr) {
    return providerIndex['dydx'];
  }
  return providerIndex['aave'];
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
  await contracts.Controller.connect(signer)
    .doRefinancing(vault.address, newProviderAddr, 1, 1, index, false)
    .catch(e => console.log(e));
}

async function shouldChange(currentRate, newRate, lastSwitch) {
  // current provider is still the best
  if (!newRate) {
    return false;
  }
  const BLOCKS_IN_HOUR = 269; // approx.
  const APR_THRESHOLD = ethers.utils.parseUnits("4", 25);

  const currentBlockNumber = await provider.getBlockNumber();
  const timeCheck = !lastSwitch
    ? true // first switch
    : currentBlockNumber - lastSwitch.blockNumber > BLOCKS_IN_HOUR;
  
  return currentRate.sub(newRate).gte(APR_THRESHOLD) && timeCheck;
}

async function checkRates(vaultName, contracts) {
  const vault = contracts[vaultName];
  const { borrowAsset } = await vault.vAssets();
  const activeProviderAddr = await vault.activeProvider();
  
  const activeProviderName = getProviderName(activeProviderAddr, contracts);

  const currentRate = await contracts[activeProviderName]
    .getBorrowRateFor(borrowAsset);

  const providers = await vault.getProviders();

  const rates = [];
  for (let i = 0; i < providers.length; i++) {
    const providerName = getProviderName(providers[i], contracts);
    const rate = await contracts[providerName].getBorrowRateFor(borrowAsset);
    rates.push(rate);
  }

  const { index: bestProviderIndex } = rates
    .reduce(({ savedRate, index }, rate, i) => (
      savedRate.gt(rate) ? { savedRate: rate, index: i } : { savedRate, index }
    ), { savedRate: currentRate, index: null });

  const filterSwitches = vault.filters.Switch();
  const events = await vault.queryFilter(filterSwitches, -10);
  const lastSwitch = events[events.length - 1];
  const toChange = await shouldChange(currentRate, rates[bestProviderIndex], lastSwitch);

  if (toChange) {
    console.log(`-> proceed to swtich activeProvider of ${vaultName}`);
    await switchProviders(contracts, vault, providers[bestProviderIndex])
      .then(_ => console.log(`---> successfully switched provider of ${vaultName}`));
  }
}

async function main() {
  const contracts = await loadContracts(signer);

  for (let v = 0; v < vaultsList.length; v++) {
    const vaultName = vaultsList[v];
    await checkRates(vaultName, contracts);
  }
}

main();
