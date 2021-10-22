import { ethers, BigNumber } from 'ethers';
import { VAULTS } from '../consts/index.js';
import { getSigner } from './signer.js';

const { formatEther, formatUnits, parseUnits } = ethers.utils;

const signer = getSigner();

const getBorrowers = async (vault, currentBlock, searchLength) => {

  const startBlock = VAULTS[vault.address.toLowerCase()].deployBlockNumber;
  const filterBorrowers = vault.filters.Borrow();
  const events = await vault.queryFilter(
    filterBorrowers,
    searchLength ? currentBlock - searchLength : startBlock,
  );
  const borrowers = events
    .map(e => e.args.userAddrs)
    .reduce((acc, userAddr) => (acc.includes(userAddr) ? acc : [...acc, userAddr]), []);
  return borrowers;
};

const pushNew = (newBorrowers, current) => {
  newBorrowers.forEach(e => {
    if (!current.includes(e)) {
      console.log('new borrower:', e);
      current.push(e);
    }
  });
  return current;
};

const buildOne = async (addr, vault, f1155) => {
  const { borrowID, collateralID } = await vault.vAssets();

  const collateralBalance = await f1155.balanceOf(addr, collateralID);
  const borrowBalance = await f1155.balanceOf(addr, borrowID);

  const neededCollateral = await vault.getNeededCollateralFor(borrowBalance, true);

  // (debt + 43/1000 * debt) * price
  const bonus = borrowBalance.mul(BigNumber.from(43)).div(BigNumber.from(1000));
  let calcAmount = borrowBalance.add(bonus);
  calcAmount = await vault.getNeededCollateralFor(calcAmount, false);

  return {
    debt: borrowBalance,
    collateral: collateralBalance,
    neededCollateral,
    liquidatable: collateralBalance.lt(neededCollateral),
    solvent: collateralBalance.gt(calcAmount),
  };
};

const buildPositions = async (borrowers, vault, decimals, f1155) => {
  const toLiquidate = [];
  const stats = {
    totalDebt: BigNumber.from(0),
    totalCollateral: BigNumber.from(0),
    totalNeeded: BigNumber.from(0),
  };
  for (let i = 0; i < borrowers.length; i++) {
    const borrower = borrowers[i];
    let position = await buildOne(borrower, vault, f1155);

    position = {
      account: borrower,
      ...position,
    };

    if (position.liquidatable && position.debt.gt(parseUnits('10', decimals))) {
      toLiquidate.push(position);
    }

    stats.totalDebt = stats.totalDebt.add(position.debt);
    stats.totalCollateral = stats.totalCollateral.add(position.collateral);
    stats.totalNeeded = stats.totalNeeded.add(position.neededCollateral);
  }

  return [toLiquidate, stats];
};

const logStatus = async (positions, stats, decimals) => {
  const toLog = positions.map(pos => ({
    account: pos.account,
    debt: Number(formatUnits(pos.debt, decimals)).toFixed(3),
    collateral: Number(formatEther(pos.collateral)).toFixed(3),
    neededCollateral: Number(formatEther(pos.neededCollateral)).toFixed(3),
    liquidatable: pos.liquidatable,
    solvent: pos.solvent,
  }));

  console.table(toLog);
  console.log('Total outstanding debt positions (exclude only-depositors)');
  console.table({
    totalDebt: Number(formatUnits(stats.totalDebt, decimals)).toFixed(3),
    totalCollateral: Number(formatEther(stats.totalCollateral)).toFixed(3),
    totalNeeded: Number(formatEther(stats.totalNeeded)).toFixed(3),
  });
};

export { getBorrowers, pushNew, logStatus, buildPositions };
