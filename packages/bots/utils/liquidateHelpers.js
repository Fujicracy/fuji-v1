const { promisify } = require('util');
const redis = require('redis');
const { ethers } = require('ethers');

const { formatEther, formatUnits } = ethers.utils;

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

const searchBorrowers = async (vault, searchLength) => {
  const filterBorrowers = vault.filters.Borrow();
  const events = await vault.queryFilter(filterBorrowers, searchLength);
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

const buildPositions = async (borrowers, vault, contracts, checkUserPosition, decimals) => {
  const positions = [];
  const toLiquidate = [];
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

    if (position.liquidatable) {
      toLiquidate.push(borrower);
    }

    positions.push({
      Account: borrower,
      Debt: Number(formatUnits(position.debt, decimals)).toFixed(3),
      Collateral: Number(formatEther(position.collateral)).toFixed(3),
      'Needed Collateral': Number(formatEther(position.needed)).toFixed(3),
      Liquidatable: position.liquidatable ? 'X' : '-',
    });
  }

  return [toLiquidate, positions, stats];
};

const logStatus = async (positions, stats, decimals) => {
  console.table(positions);
  console.log('Total outstanding debt positions (exclude only-depositors)');
  console.table({
    totalDebt: Number(formatUnits(stats.totalDebt, decimals)).toFixed(3),
    totalCollateral: Number(formatEther(stats.totalCollateral)).toFixed(3),
    totalNeeded: Number(formatEther(stats.totalNeeded)).toFixed(3),
  });
};

module.exports = { searchBorrowers, connectRedis, pushNew, logStatus, buildPositions };
