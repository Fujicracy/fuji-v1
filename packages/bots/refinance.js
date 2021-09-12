import retry from 'async-retry';
import chalk from 'chalk';
import { ethers, BigNumber } from 'ethers';
import { VAULTS, VAULTS_ADDRESS, PROVIDERS } from './consts/index.js';
import { loadContracts, getSigner, getFlashloanProvider } from './utils/index.js';

const { utils } = ethers;

const signer = getSigner();

function getProviderName(providerAddr) {
  const provider = Object.values(PROVIDERS).find(p => p.address === providerAddr.toLowerCase());
  return provider.name;
}

async function switchProviders(contracts, vault, newProviderAddr) {
  const index = await getFlashloanProvider(vault);
  let gasLimit = await contracts.Controller.connect(signer).estimateGas.doRefinancing(
    vault.address,
    newProviderAddr,
    1,
    1,
    index,
  );
  // increase by 10%
  gasLimit = gasLimit.add(gasLimit.div(BigNumber.from('10')));

  return contracts.Controller.connect(signer).doRefinancing(
    vault.address,
    newProviderAddr,
    1,
    1,
    index,
    { gasLimit },
  );
}

async function shouldChange(currentRate, newRate, lastSwitch) {
  // current provider is still the best
  if (!newRate) {
    return false;
  }
  const BLOCKS_IN_HOUR = 269; // approx.
  // change when difference in APRs is more than 4%
  const APR_THRESHOLD = utils.parseUnits('4', 25);

  const currentBlockNumber = await signer.provider.getBlockNumber();
  const timeCheck = !lastSwitch
    ? true // first switch
    : // check if last switch was at least 1h ago
      currentBlockNumber - lastSwitch.blockNumber > BLOCKS_IN_HOUR;

  return currentRate.sub(newRate).gte(APR_THRESHOLD) && timeCheck;
}

async function checkRates(vaultName, contracts) {
  console.log('Checking', chalk.yellow(`${vaultName} ...`));
  const vaultContract = contracts[vaultName];
  const vault = VAULTS[vaultContract.address.toLowerCase()];
  const borrowAsset = vault.borrowAsset;

  const activeProviderAddr = await vaultContract.activeProvider();
  const activeProviderName = getProviderName(activeProviderAddr);

  const currentRate = await contracts[activeProviderName].getBorrowRateFor(borrowAsset.address);

  const providers = vault.providers;

  let bestRate = currentRate;
  let bestProviderAddr;
  for (let i = 0; i < providers.length; i++) {
    const rate = await contracts[providers[i].name].getBorrowRateFor(borrowAsset.address);

    // determine provider with best rate
    if (rate.lt(bestRate)) {
      bestRate = rate;
      bestProviderAddr = providers[i].address;
    }
  }

  const filterSwitches = vaultContract.filters.Switch();
  // Filter all Switch events
  const events = await vaultContract.queryFilter(filterSwitches);
  const lastSwitch = events[events.length - 1];
  const toChange = await shouldChange(currentRate, bestRate, lastSwitch);

  if (toChange) {
    console.log(`-> proceed to swtich activeProvider of ${vaultName}`);

    const res = await switchProviders(contracts, vaultContract, bestProviderAddr);

    if (res && res.hash) {
      console.log(`TX submited: ${res.hash}`);
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Switch')) {
        console.log(chalk.blue(`---> successfully switched provider of ${vaultName}`));
      }
    }
  } else {
    console.log(chalk.cyan('-> not due for refinance'));
  }
}

async function checkForRefinance(contracts) {
  const vaultsList = Object.keys(VAULTS_ADDRESS);
  for (let v = 0; v < vaultsList.length; v++) {
    const vaultName = vaultsList[v];
    await checkRates(vaultName, contracts);
  }
}

function delay(s) {
  return new Promise(r => setTimeout(r, s * 1000));
}

async function main() {
  console.log('Start checking for refinancing...');

  const contracts = await loadContracts(signer.provider);

  // eslint-disable-next-line
  while (true) {
    try {
      await retry(
        async () => {
          await checkForRefinance(contracts);
        },
        {
          retries: process.env.RETRIES_COUNT || 2, // default 2 retries
          minTimeout: (process.env.RETRIES_TIMEOUT || 2) * 1000, // delay between retries in ms, default 2000
          randomize: false,
          onRetry: error => {
            console.log('An error was thrown in the execution loop - retrying', error);
          },
        },
      );
    } catch (error) {
      console.log('Unsuccessful retries');
    }
    // delay, default 15 minutes
    await delay(process.env.DELAY || 15 * 60);
  }
}

main();
