import { ethers, BigNumber } from 'ethers';

const { formatUnits, parseUnits } = ethers.utils;

const getBorrowers = async (vault, startBlock, currentBlock, searchLength) => {
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

const getBalances = async (borrowers, vaultContract, f1155Contract) => {
  const { borrowID, collateralID } = await vaultContract.vAssets();
  const addrs = [];
  const ids = [];

  borrowers.forEach(addr => {
    addrs.push(addr);
    addrs.push(addr);
    ids.push(collateralID);
    ids.push(borrowID);
  });

  return await f1155Contract.balanceOfBatch(addrs, ids);
}

const getNeededCollateralFor = (amount, collatF, safetyF, price, borrowDecimals) => {
  // from FujiVault.sol:
  //uint256 minimumReq = (_amount * price) / (10**uint256(_borrowAssetDecimals));
  //return (minimumReq * (collatF.a) * (safetyF.a)) / (collatF.b) / (safetyF.b);
  return amount.mul(price)
    .div(BigNumber.from(`${Math.pow(10, borrowDecimals)}`))
    .mul(collatF.a).mul(safetyF.a)
    .div(collatF.b).div(safetyF.b);
}

const buildPositions = async (borrowers, vault, contracts) => {
  const toLiquidate = [];
  const stats = {
    totalDebt: BigNumber.from(0),
    totalCollateral: BigNumber.from(0),
    totalNeeded: BigNumber.from(0),
  };

  const vaultContract = contracts[vault.name];
  const borrowDecimals = vault.borrowAsset.decimals;
  const collateralDecimals = vault.collateralAsset.decimals;
  const collatF = await vaultContract.collatF();
  const safetyF = await vaultContract.safetyF();
  const price = await contracts.FujiOracle.getPriceOf(
    vault.collateralAsset.address,
    vault.borrowAsset.address,
    BigNumber.from(collateralDecimals)
  );

  const balances = await getBalances(borrowers, vaultContract, contracts.FujiERC1155);
  for (let i = 0; i < balances.length; i = i + 2) {
    const borrower = borrowers[i / 2];
    const collateralBalance = balances[i];
    const borrowBalance = balances[i + 1];

    const neededCollateral = getNeededCollateralFor(
      borrowBalance,
      collatF,
      safetyF,
      price,
      borrowDecimals
    );

    // (debt + 43/1000 * debt) * price
    const bonus = borrowBalance.mul(BigNumber.from(43)).div(BigNumber.from(1000));
    // as getNeededCollateralFor without factors
    const calcAmount = borrowBalance.add(bonus).mul(price)
      .div(BigNumber.from(`${Math.pow(10, borrowDecimals)}`));

    const position = {
      account: borrower,
      debt: borrowBalance,
      collateral: collateralBalance,
      neededCollateral,
      liquidatable: collateralBalance.lt(neededCollateral),
      solvent: collateralBalance.gt(calcAmount),
    };

    if (position.liquidatable && position.debt.gt(parseUnits('10', borrowDecimals))) {
      toLiquidate.push(position);
    }

    stats.totalDebt = stats.totalDebt.add(position.debt);
    stats.totalCollateral = stats.totalCollateral.add(position.collateral);
    stats.totalNeeded = stats.totalNeeded.add(position.neededCollateral);
  }

  return [toLiquidate, stats];
};

const logStatus = async (positions, stats, vault) => {
  const borrowDecimals = vault.borrowAsset.decimals;
  const collateralDecimals = vault.collateralAsset.decimals;

  const toLog = positions.map(pos => ({
    account: pos.account,
    debt: Number(formatUnits(pos.debt, borrowDecimals)).toFixed(3),
    collateral: Number(formatUnits(pos.collateral, collateralDecimals)).toFixed(3),
    neededCollateral: Number(formatUnits(pos.neededCollateral, collateralDecimals)).toFixed(3),
    liquidatable: pos.liquidatable,
    solvent: pos.solvent,
  }));

  console.table(toLog);
  console.log('Total outstanding debt positions (exclude only-depositors)');
  console.table({
    totalDebt: Number(formatUnits(stats.totalDebt, borrowDecimals)).toFixed(3),
    totalCollateral: Number(formatUnits(stats.totalCollateral, collateralDecimals)).toFixed(3),
    totalNeeded: Number(formatUnits(stats.totalNeeded, collateralDecimals)).toFixed(3),
  });
};

export { getBorrowers, logStatus, buildPositions };
