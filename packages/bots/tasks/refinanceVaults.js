import retry from 'async-retry';
import chalk from 'chalk';
import { ethers, BigNumber } from 'ethers';
import { VAULTS, PROVIDERS } from '../consts/index.js';
import { loadContracts, getSigner, getFlashloanProvider } from '../utils/index.js';

const { utils } = ethers;

function getProviderName(contracts, addr) {
  const provider = Object.values(PROVIDERS).find(
    p => contracts[p.name] && contracts[p.name].address.toLowerCase() === addr.toLowerCase(),
  );
  return provider.name;
}

async function executeSwitchFTM(setup, vault, newProviderAddr) {
  const { contracts, signer } = setup;
  return contracts.Controller.connect(signer).doRefinancing(
    vault.address,
    newProviderAddr,
    1,
    1,
    '0',
  );
}

async function executeSwitchETH(setup, vault, newProviderAddr) {
  const { contracts, signer } = setup;

  const index = await getFlashloanProvider(setup, vault);
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

async function executeSwitch(setup, vault, newProviderAddr) {
  const { config } = setup;
  if (config.networkName === 'ethereum') {
    return executeSwitchETH(setup, vault, newProviderAddr);
  } else if (config.networkName === 'fantom') {
    return executeSwitchFTM(setup, vault, newProviderAddr);
  }
}

function shouldSwitch(vault, rates, blocks) {
  const { thresholdAPR, hoursSinceLast } = vault.refinanceConfig;

  // current provider is still the best
  if (rates.best.eq(rates.current)) {
    return false;
  }
  // difference in APRs
  const thresholdBN = utils.parseUnits(thresholdAPR.toString(), 25);
  const isGreater = rates.current.sub(rates.best).gte(thresholdBN);

  // approx. blocks in hour
  const BLOCKS_IN_HOUR = 269;

  if (isGreater) {
    // is first switch or
    // if last switch meets hoursSinceLast criteria
    return !blocks.last || blocks.current - blocks.last > BLOCKS_IN_HOUR * hoursSinceLast;
  }
  return false;
}

async function switchProviders(setup, vaultName, vaultContract, bestProviderAddr) {
  console.log(`-> proceed to swtich activeProvider of ${vaultName}`);

  const res = await executeSwitch(setup, vaultContract, bestProviderAddr);

  if (res && res.hash) {
    console.log(`TX submited: ${res.hash}`);
    const receipt = await res.wait();
    if (receipt && receipt.events && receipt.events.find(e => e.event === 'Switch')) {
      console.log(chalk.blue(`---> successfully switched provider of ${vaultName}`));
    }
  }
}

async function checkRates(setup, vault) {
  const { contracts, signer } = setup;

  console.log('Checking', chalk.yellow(`${vault.name} ...`));
  const vaultContract = contracts[vault.name];
  const borrowAsset = vault.borrowAsset;

  const activeProviderAddr = await vaultContract.activeProvider();
  const activeProviderName = getProviderName(contracts, activeProviderAddr);

  const currentRate = await contracts[activeProviderName].getBorrowRateFor(borrowAsset.address);
  const rates = {
    best: currentRate,
    current: currentRate,
  };

  const providers = vault.providers;

  let bestProviderAddr;
  for (let i = 0; i < providers.length; i++) {
    const rate = await contracts[providers[i].name].getBorrowRateFor(borrowAsset.address);

    // determine provider with best rate
    if (rate.lt(rates.best)) {
      rates.best = rate;
      bestProviderAddr = contracts[providers[i].name].address;
    }
  }

  const filterSwitches = vaultContract.filters.Switch();
  // Filter all Switch events
  const events = await vaultContract.queryFilter(filterSwitches);
  const lastSwitch = events[events.length - 1];
  const blocks = {
    last: lastSwitch ? lastSwitch.blockNumber : null,
    current: await signer.provider.getBlockNumber(),
  };
  const toChange = shouldSwitch(vault, rates, blocks);

  if (toChange) {
    await switchProviders(setup, vault.name, vaultContract, bestProviderAddr);
  } else {
    console.log(chalk.cyan('-> not due for refinance'));
  }
}

async function checkForRefinance(setup) {
  const { config, deployment } = setup;

  const vaults = Object.values(VAULTS[config.networkName][deployment].VAULTS);
  for (let i = 0; i < vaults.length; i++) {
    await checkRates(setup, vaults[i]);
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
  const setup = { config, signer, contracts, deployment };

  // eslint-disable-next-line
  while (true) {
    try {
      await retry(
        async () => {
          await checkForRefinance(setup);
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
