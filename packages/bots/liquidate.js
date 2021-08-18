import retry from 'async-retry';
import chalk from 'chalk';
import { ethers, BigNumber } from 'ethers';
import { ASSETS, VAULTS_ADDRESS } from './consts/index.js';
import {
  loadContracts,
  getSigner,
  getGasPrice,
  getETHPrice,
  getFlashloanProvider,
  getBorrowers,
  connectRedis,
  pushNew,
  buildPositions,
  logStatus,
} from './utils/index.js';
const { utils } = ethers;

const signer = getSigner();

const isViable = (positions, gasPrice, gasLimit, ethPrice, decimals) => {
  let totalDebt = BigNumber.from(0);

  for (let i = 0; i < positions.length; i += 1) {
    totalDebt = totalDebt.add(positions[i].debt);
  }

  const formatUnits = utils.formatUnits;

  let bonus = totalDebt.mul(BigNumber.from(43)).div(BigNumber.from(1000));
  bonus = formatUnits(bonus.toString(), decimals);

  let cost = formatUnits(gasLimit.mul(BigNumber.from(gasPrice)).toString());
  cost *= ethPrice;

  console.log('Estimated bonus (USD): ', chalk.blue(bonus));
  console.log('Estimated cost (USD): ', chalk.red(cost));

  return cost * 1.5 < bonus;
};

const liquidateAll = async (toLiq, vault, decimals, contracts) => {
  const positions = toLiq.filter(p => p.solvent);
  if (positions.length === 0) {
    console.log('---> All liquidatable positions are unsolvent.');
    return;
  }

  const index = await getFlashloanProvider(vault, contracts);
  const gasPrice = await getGasPrice();
  const ethPrice = await getETHPrice();

  let gasLimit = await contracts.Fliquidator.estimateGas.flashBatchLiquidate(
    positions.map(p => p.account),
    vault.address,
    index,
  );

  if (!isViable(positions, gasPrice, gasLimit, ethPrice, decimals)) {
    console.log(chalk.red('!!! Cost of liquidations exceeds bonus'));
    return;
  }
  console.log(chalk.green('---> Proceed to liquidations'));

  // increase by 10% to prevent outOfGas tx failing
  gasLimit = gasLimit.add(gasLimit.div(BigNumber.from('10')));

  try {
    const res = await contracts.Fliquidator.connect(signer).flashBatchLiquidate(
      positions.map(p => p.account),
      vault.address,
      index,
      { gasLimit },
    );
    if (res && res.hash) {
      console.log(`TX submited: ${res.hash}`);
      const receipt = await res.wait();
      if (receipt && receipt.events) {
        const events = receipt.events.filter(e => e.event === 'FlashLiquidate');
        console.log('Liquidated: ', chalk.blue(events.length), ' positions.');
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const getAllBorrowers = async vault => {
  console.log('---> find borrowers');

  let borrowers;
  if (process.env.REDIS) {
    console.log('---> using redis');
    const client = await connectRedis();
    borrowers = await client.get('borrowers');

    if (!borrowers) {
      console.log('---> no cached borrowers');
      borrowers = await getBorrowers(vault);
      await client.set('borrowers', JSON.stringify(borrowers));
    } else {
      borrowers = JSON.parse(borrowers);
      console.log('---> cached borrowers, fetch only new');
      const newBorrowers = await getBorrowers(vault, 10);
      borrowers = pushNew(newBorrowers, borrowers);

      await client.set('borrowers', JSON.stringify(borrowers));
    }
  } else {
    console.log('---> not using redis');
    borrowers = await getBorrowers(vault);
  }
  return borrowers;
};

const checkForLiquidations = async () => {
  const contracts = await loadContracts(signer.provider);

  const vaultsList = Object.keys(VAULTS_ADDRESS);
  for (let v = 0; v < vaultsList.length; v++) {
    const vaultName = vaultsList[v];
    console.log('Checking BORROW positions in', chalk.blue(vaultName));

    const vault = contracts[vaultName];
    const { borrowAsset } = await vault.vAssets();
    const decimals = Object.values(ASSETS).find(a => a.address === borrowAsset);

    const borrowers = await getAllBorrowers(vault);
    const [toLiq, stats] = await buildPositions(borrowers, vault, decimals, contracts.FujiERC1155);

    logStatus(toLiq, stats, decimals);

    if (toLiq.length > 0) {
      await liquidateAll(toLiq, vault, decimals, contracts);
    }

    console.log('\n===============\n');
  }
};

const delay = s => {
  return new Promise(r => setTimeout(r, s * 1000));
};

const main = async () => {
  console.log('Start checking for liquidations...');

  // eslint-disable-next-line
  while (true) {
    try {
      await retry(
        async () => {
          await checkForLiquidations();
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

main();
