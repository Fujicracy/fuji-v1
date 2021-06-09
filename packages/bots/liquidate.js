/* eslint-disable prettier/prettier */
require('dotenv').config();

const retry = require('async-retry');
const chalk = require('chalk');
const { ethers, Wallet } = require('ethers');
const {
  longSearchBorrowers,
  shortSearchBorrowers,
  connectRedis,
} = require('./utils/liquidateHelpers');
const {
  loadContracts,
  // getLiquidationProviderIndex,
  USDC_ADDR,
} = require('./utils');

const { formatEther, formatUnits } = ethers.utils;

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

// async function liquidate(addr, vault, contracts) {
// console.log(
// "Position",
// chalk.cyan(addr),
// chalk.red("-> proceed to liquidation")
// );
// const index = await getLiquidationProviderIndex(vault, contracts);
// await contracts.Fliquidator.connect(signer)
// .flashLiquidate(addr, vault.address, index)
// .catch((e) => {
// console.log(e);
/// / const body = JSON.parse(e.body);
/// / const { message } = body.error;
/// / console.log(`----> Liquidation failed: ${message}`);
// });
// }

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

    let borrowAsset;
    try {
      const res = await vault.owner();
      console.log(res);
      borrowAsset = res.borrowAsset;
    } catch (err) {
      console.log(err);
    }
    const decimals = borrowAsset === USDC_ADDR ? 6 : 18;

    console.log('find borrowers');
    let borrowers;
    if (process.env.REDIS) {
      console.log('using redis');
      const client = await connectRedis();
      borrowers = await client.get('borrowers');

      if (!borrowers) {
        console.log('no cached borrowers');
        borrowers = await longSearchBorrowers(vault);
        await client.set('borrowers', JSON.stringify(borrowers));
      } else {
        borrowers = JSON.parse(borrowers);
        console.log(borrowers);
        console.log('cached borrowers, fetch only new');
        const newBorrowers = await shortSearchBorrowers(vault);
        newBorrowers.forEach(e => {
          if (!borrowers.includes(e)) {
            console.log('new borrower:', e);
            borrowers.push(e);
          }
        });
        await client.set('borrowers', JSON.stringify(borrowers));
      }
    } else {
      console.log('not using redis');
      borrowers = await longSearchBorrowers(vault);
    }

    const positions = [];
    const stats = {
      totalDebt: ethers.BigNumber.from(0),
      totalCollateral: ethers.BigNumber.from(0),
      totalNeeded: ethers.BigNumber.from(0),
    };
    for (let i = 0; i < borrowers.length; i++) {
      const borrower = borrowers[i];
      const position = await checkUserPosition(borrower, vault, contracts);
      stats.totalDebt = stats.totalDebt.add(position.debt);
      stats.totalCollateral = stats.totalCollateral.add(position.collateral);
      stats.totalNeeded = stats.totalNeeded.add(position.needed);

      positions.push({
        Account: borrower,
        Debt: Number(formatUnits(position.debt, decimals)).toFixed(3),
        Collateral: Number(formatEther(position.collateral)).toFixed(3),
        'Needed Collateral': Number(formatEther(position.needed)).toFixed(3),
        Liquidatable: position.liquidatable ? 'X' : '-',
      });
    }
    console.table(positions);
    console.log('Total outstanding debt positions (exclude only-depositors)');
    console.table({
      totalDebt: Number(formatUnits(stats.totalDebt, decimals)).toFixed(3),
      totalCollateral: Number(formatEther(stats.totalCollateral)).toFixed(3),
      totalNeeded: Number(formatEther(stats.totalNeeded)).toFixed(3),
    });
  }
}

function delay(s) {
  return new Promise(r => setTimeout(r, s * 1000));
}

async function main() {
  console.log('Start checking for liquidations...');

  const contracts = await loadContracts(signer);

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
