/* eslint-disable prettier/prettier */
require('dotenv').config();

const retry = require('async-retry');
const chalk = require('chalk');
const { ethers, Wallet } = require('ethers');
const {
  searchBorrowers,
  connectRedis,
  pushNew,
  buildPositions,
  logStatus,
} = require('./utils/liquidateHelpers');
const {
  loadContracts,
  getLiquidationProviderIndex,
  USDC_ADDR,
} = require('./utils');

let provider;
if (process.env.INFURA) {
  provider = new ethers.providers.InfuraProvider('homestead', process.env.PROJECT_ID);
} else {
  provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER_URL);
}

let signer;
if (process.env.PRIVATE_KEY) {
  signer = new Wallet(process.env.PRIVATE_KEY, provider);
} else {
  throw new Error('PRIVATE_KEY not set: please, set it in ".env"!');
}

const vaultsList = ['VaultETHDAI', 'VaultETHUSDC'];

async function liquidateAll(addresses, vault, contracts) {
  // console.log('Position', chalk.cyan(addr), chalk.red('-> proceed to liquidation'));
  const index = await getLiquidationProviderIndex(vault, contracts);
  try {
    await contracts.Fliquidator.connect(signer).flashBatchLiquidate(
      addresses,
      vault.address,
      index,
    );
  } catch (err) {
    console.log(err);
    // / / const body = JSON.parse(e.body);
    // / / const { message } = body.error;
    // / / console.log(`----> Liquidation failed: ${message}`);
  }
}

async function checkUserPosition(addr, vault, contracts) {
  const { borrowID, collateralID } = await vault.vAssets();

  const collateralBalance = await contracts.FujiERC1155.balanceOf(addr, collateralID);
  const borrowBalance = await contracts.FujiERC1155.balanceOf(addr, borrowID);

  const neededCollateral = await vault.getNeededCollateralFor(borrowBalance, 'true');

  return {
    debt: borrowBalance,
    collateral: collateralBalance,
    needed: neededCollateral,
    liquidatable: collateralBalance.lt(neededCollateral),
  };
}

async function checkForLiquidations() {
  const contracts = await loadContracts(signer);

  console.log('contracts');

  for (let v = 0; v < vaultsList.length; v++) {
    const vaultName = vaultsList[v];
    console.log('Checking BORROW positions in', chalk.blue(vaultName));

    const vault = contracts[vaultName];
    const { borrowAsset } = await vault.vAssets();
    const decimals = borrowAsset === USDC_ADDR ? 6 : 18;

    console.log('find borrowers');
    let borrowers;
    if (process.env.REDIS) {
      console.log('using redis');
      const client = await connectRedis();
      borrowers = await client.get('borrowers');

      if (!borrowers) {
        console.log('no cached borrowers');
        borrowers = await searchBorrowers(vault);
        await client.set('borrowers', JSON.stringify(borrowers));
      } else {
        borrowers = JSON.parse(borrowers);
        console.log(borrowers);
        console.log('cached borrowers, fetch only new');
        const newBorrowers = await searchBorrowers(vault, 10);
        borrowers = pushNew(newBorrowers, borrowers);

        await client.set('borrowers', JSON.stringify(borrowers));
      }
    } else {
      console.log('not using redis');
      borrowers = await searchBorrowers(vault);
    }

    const [toLiq, positions, stats] = await buildPositions(
      borrowers,
      vault,
      contracts,
      checkUserPosition,
      decimals,
    );
    logStatus(positions, stats, decimals);

    if (toLiq.length > 0) {
      await liquidateAll(toLiq, vault, contracts);
    }
  }
}

function delay(s) {
  return new Promise(r => setTimeout(r, s * 1000));
}

async function main() {
  console.log('Start checking for liquidations...');

  while (true) {
    try {
      await retry(
        async () => {
          await checkForLiquidations();
        },
        {
          retries: process.env.RETRIES_COUNT || 2, //default 2 retries
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
}

main();
