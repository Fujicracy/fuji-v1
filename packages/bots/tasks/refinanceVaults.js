import retry from 'async-retry';
import chalk from 'chalk';
import { ethers, BigNumber } from 'ethers';
import { VAULTS, PROVIDERS } from '../consts/index.js';
import { loadContracts, getSigner, getFlashloanProvider } from '../utils/index.js';

const { utils } = ethers;

function getProviderName(contracts, addr) {
  const provider = Object.values(PROVIDERS).find(
    p => contracts[p.name].address.toLowerCase() === addr.toLowerCase(),
  );
  return provider.name;
}

async function switchProviders(contracts, signer, vault, newProviderAddr) {
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

async function shouldChange(currentRate, currentBlock, newRate, lastSwitch) {
  // current provider is still the best
  if (!newRate) {
    return false;
  }
  const BLOCKS_IN_HOUR = 269; // approx.
  // change when difference in APRs is more than 4%
  const APR_THRESHOLD = utils.parseUnits('4', 25);

  const timeCheck = !lastSwitch
    ? true // first switch
    : // check if last switch was at least 2h ago
      currentBlock - lastSwitch.blockNumber > BLOCKS_IN_HOUR;

  return currentRate.sub(newRate).gte(APR_THRESHOLD) && timeCheck;
}

async function checkRates(contracts, signer, vault) {
  console.log('Checking', chalk.yellow(`${vault.name} ...`));
  const vaultContract = contracts[vault.name];
  const borrowAsset = vault.borrowAsset;

  const activeProviderAddr = await vaultContract.activeProvider();
  const activeProviderName = getProviderName(contracts, activeProviderAddr);

  const currentRate = await contracts[activeProviderName].getBorrowRateFor(borrowAsset.address);

  const providers = vault.providers;

  let bestRate = currentRate;
  let bestProviderAddr;
  for (let i = 0; i < providers.length; i++) {
    const rate = await contracts[providers[i].name].getBorrowRateFor(borrowAsset.address);

    // determine provider with best rate
    if (rate.lt(bestRate)) {
      bestRate = rate;
      bestProviderAddr = contracts[providers[i].name].address;
    }
  }

  const filterSwitches = vaultContract.filters.Switch();
  // Filter all Switch events
  const events = await vaultContract.queryFilter(filterSwitches);
  const lastSwitch = events[events.length - 1];
  const currentBlock = await signer.provider.getBlockNumber();
  const toChange = await shouldChange(currentRate, currentBlock, bestRate, lastSwitch);

  if (toChange) {
    console.log(`-> proceed to swtich activeProvider of ${vault.name}`);

    const res = await switchProviders(contracts, signer, vaultContract, bestProviderAddr);

    if (res && res.hash) {
      console.log(`TX submited: ${res.hash}`);
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Switch')) {
        console.log(chalk.blue(`---> successfully switched provider of ${vault.name}`));
      }
    }
  } else {
    console.log(chalk.cyan('-> not due for refinance'));
  }
}

async function checkForRefinance(contracts, signer, networkName, deployment) {
  const vaults = Object.values(VAULTS[networkName][deployment].VAULTS);
  for (let i = 0; i < vaults.length; i++) {
    await checkRates(contracts, signer, vaults[i]);
  }
}

function delay(s) {
  return new Promise(r => setTimeout(r, s * 1000));
}

async function refinanceVaults(config, deployment) {
  console.log(
    `Start checking for refinancing in ${config.networkName} NETWORK for ${deployment} deployment...`,
  );
  const signer = getSigner(config);

  const contracts = await loadContracts(signer.provider, config.chainId, deployment);

  // eslint-disable-next-line
  while (true) {
    try {
      await retry(
        async () => {
          await checkForRefinance(contracts, signer, config.networkName, deployment);
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

export { refinanceVaults };
