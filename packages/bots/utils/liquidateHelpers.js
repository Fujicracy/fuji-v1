const { promisify } = require('util');
const redis = require('redis');
const { ethers, BigNumber } = require('ethers');

const { formatEther, formatUnits, parseUnits } = ethers.utils;

const contractDeployBlock = async provider => {
  // const ETHDAICreateTX = '0x297ba28fe4e08efa9cf280063997b1a56b6243eb64df4baf9559610a6744b384';
  // const ETHUSDCCreateTX = '0xff5ba53aa7be41b6fa2bd7d1bb468c4f37b34e48f99a537fcd6a1105c8cb25c5';
  // const daiStartBlock = (await provider.getTransaction(ETHDAICreateTX)).blockNumber;
  // const usdcStartBlock = (await provider.getTransaction(ETHUSDCCreateTX)).blockNumber;
  const currentBlock = await provider.getBlockNumber();
  return {
    // daivault
    '0x6E16394cBF840fc599FA3d9e5D1E90949c32a4F5': 12386446,
    // usdcvault
    '0xd0dc4Cc10fCf3fEe2bF5310c0E4e097b60F097D3': 12418746,
    currentBlock,
  };
};

const connectRedis = async () => {
  const client = redis.createClient({ port: 6379 });

  // console.log(client);

  client.on('error', function (error) {
    console.error(error);
  });

  const methods = {
    get: promisify(client.get).bind(client),
    set: promisify(client.set).bind(client),
    hmset: promisify(client.hmset).bind(client),
  };

  return methods;
};

const searchBorrowers = async (provider, vault, searchLength) => {
  const info = await contractDeployBlock(provider);
  const currentBlock = info.currentBlock;
  const startBlock = info[vault.address];
  console.log(startBlock);
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

module.exports = { searchBorrowers, connectRedis, pushNew, logStatus, buildPositions };
