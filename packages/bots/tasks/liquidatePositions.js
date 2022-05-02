import retry from 'async-retry';
import chalk from 'chalk';
import { ethers, BigNumber } from 'ethers';
import { VAULTS } from '../consts/index.js';
import {
  loadContracts,
  getSigner,
  getGasPrice,
  getPriceOf,
  getFlashloanProvider,
  getBorrowers,
  connectRedis,
  buildPositions,
  logStatus,
} from '../utils/index.js';

const { utils } = ethers;

const isViable = (positions, gasPrice, gasLimit, ethPrice, decimals) => {
  let totalDebt = BigNumber.from(0);

  for (let i = 0; i < positions.length; i += 1) {
    totalDebt = totalDebt.add(positions[i].debt);
  }

  const formatUnits = utils.formatUnits;

  // 4.3%
  let bonus = totalDebt.mul(BigNumber.from(43)).div(BigNumber.from(1000));
  bonus = formatUnits(bonus.toString(), decimals);

  let cost = formatUnits(gasLimit.mul(BigNumber.from(gasPrice)).toString());
  cost *= ethPrice;

  console.log('Estimated bonus (USD): ', chalk.blue(bonus));
  console.log('Estimated cost (USD): ', chalk.red(cost));

  return cost < bonus;
};

const liquidateAll = async (setup, toLiq, vault, decimals) => {
  const { config, contracts, signer } = setup;

  const positions = toLiq.filter(p => p.solvent);
  if (positions.length === 0) {
    console.log('---> All liquidatable positions are insolvent.');
    return;
  }

  const fliquidatorName = config.networkName === 'fantom' ? 'FliquidatorFTM' : 'Fliquidator';
  const currency = config.networkName === 'fantom' ? 'fantom' : 'ethereum';

  const index = await getFlashloanProvider(setup, vault);
  // only for Ethereum
  const gasPrice = await getGasPrice();
  const ethPrice = await getPriceOf(currency);

  let gasLimit = await contracts[fliquidatorName].connect(signer).estimateGas.flashBatchLiquidate(
    positions.map(p => p.account),
    vault.address,
    index,
  );

  if (!isViable(positions, gasPrice, gasLimit, ethPrice, decimals)) {
    console.log(chalk.red('!!! Cost of liquidations exceeds bonus'));
    return;
  }
  console.log(chalk.green('---> Proceed to liquidations'));

  // increase by 50% to prevent outOfGas tx failing
  gasLimit = gasLimit.add(gasLimit.div(BigNumber.from('2')));

  try {
    const res = await contracts[fliquidatorName].connect(signer).flashBatchLiquidate(
      positions.map(p => p.account),
      vault.address,
      index,
      { gasLimit },
    );
    if (res && res.hash) {
      console.log(`TX submited: ${res.hash}`);
      const receipt = await res.wait();
      if (receipt && receipt.events) {
        // 'FlashLiquidate' gets emitted from alpha version Fliquidator
        // 'Liquidate' from all subsequent versions
        const events = receipt.events.filter(e => ['FlashLiquidate', 'Liquidate'].includes(e.event));
        console.log('Liquidated: ', chalk.blue(events.length), ' positions.');
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const getAllBorrowers = async (vault, startBlock, currentBlock) => {
  console.log('---> find borrowers');

  let borrowers;
  if (process.env.REDIS === 'true') {
    console.log('---> using redis');
    const client = await connectRedis();
    const vaultAddr = vault.address.toLowerCase();
    borrowers = await client.get(`borrowers-${vaultAddr}`);

    if (!borrowers) {
      console.log('---> no cached borrowers');
      borrowers = await getBorrowers(vault, startBlock, currentBlock);
      await client.set(`borrowers-${vaultAddr}`, JSON.stringify(borrowers));
    } else {
      borrowers = JSON.parse(borrowers);
      console.log('---> cached borrowers, fetch only new');
      const newBorrowers = await getBorrowers(vault, startBlock, currentBlock, 10);
      newBorrowers.forEach(b => {
        if (!borrowers.includes(b)) {
          console.log('new borrower:', b);
          borrowers.push(b);
        }
      })

      await client.set(`borrowers-${vaultAddr}`, JSON.stringify(borrowers));
    }
  } else {
    console.log('---> not using redis');
    borrowers = await getBorrowers(vault, startBlock, currentBlock);
  }
  return borrowers;
};

const checkForLiquidations = async setup => {
  const { contracts, signer, config, deployment } = setup;

  const vaults = Object.values(VAULTS[config.networkName][deployment].VAULTS);
  for (let v = 0; v < vaults.length; v++) {
    const vaultName = vaults[v].name;
    console.log('Checking BORROW positions in', chalk.blue(vaultName));

    const vaultContract = contracts[vaultName];

    const startBlock = await vaults[v].deployBlockNumber;
    const currentBlock = await signer.provider.getBlockNumber();
    const borrowers = await getAllBorrowers(vaultContract, startBlock, currentBlock);
    const [toLiq, stats] = await buildPositions(borrowers, vaults[v], contracts);

    logStatus(toLiq, stats, vaults[v]);

    if (toLiq.length > 0) {
      await liquidateAll(setup, toLiq, vaultContract, vaults[v].borrowAsset.decimals);
    }

    console.log('\n===============\n');
  }
};

const delay = s => {
  return new Promise(r => setTimeout(r, s * 1000));
};

const liquidatePositions = async (config, deployment) => {
  console.log(
    `Start checking for liquidations in ${config.networkName} NETWORK for ${deployment} deployment...`,
  );
  const signer = getSigner(config);

  const contracts = await loadContracts(signer.provider, config.chainId, deployment);
  const setup = { config, signer, contracts, deployment };

  // eslint-disable-next-line
  while (true) {
    try {
      await retry(
        async () => {
          await checkForLiquidations(setup);
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
    // delay, default 1 minutes
    await delay(process.env.DELAY || 60);
  }
};

export { liquidatePositions };
