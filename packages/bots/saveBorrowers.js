// Script that fetches borrowers from all vaults,
// sorts and filters by unique user addresses
// and creates a csv file

require('dotenv').config();

const { ethers, Wallet } = require('ethers');
const chalk = require('chalk');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { loadContracts } = require('./utils');

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

const vaultsList = ['VaultETHDAI', 'VaultETHUSDC', 'VaultETHUSDT'];

const searchBorrowers = async (vault, searchLength) => {
  const filterBorrowers = vault.filters.Borrow();
  const events = await vault.queryFilter(filterBorrowers, searchLength);

  const borrowers = [];

  for (let i = 0; i < events.length; i += 1) {
    const e = events[i];
    const block = await e.getBlock();
    borrowers.push({
      vault: vault.address,
      blockNumber: e.blockNumber,
      timestamp: block.timestamp,
      userAddr: e.args.userAddrs,
    });
  }

  return borrowers;
};

const filterAndSort = borrowers => {
  return borrowers
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber))
    .reduce((acc, borrower) => {
      if (!acc.find(({ userAddr }) => borrower.userAddr === userAddr)) return [...acc, borrower];
      return acc;
    }, []);
};

const saveFile = borrowers => {
  const csvWriter = createCsvWriter({
    path: 'fuji-borrowers.csv',
    header: [
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'userAddr', title: 'User Address' },
      { id: 'vault', title: 'Vault Address' },
    ],
  });
  csvWriter
    .writeRecords(borrowers)
    .then(() => console.log(`Successfully saved ${borrowers.length} borrowers`));
};

const getBorrowers = async () => {
  const contracts = await loadContracts(signer);

  console.log('contracts');
  let borrowers = [];

  for (let v = 0; v < vaultsList.length; v++) {
    const vaultName = vaultsList[v];
    console.log('Searching BORROW positions in', chalk.blue(vaultName));

    const vault = contracts[vaultName];

    const found = await searchBorrowers(vault);
    borrowers.push(...found);
  }

  borrowers = filterAndSort(borrowers);
  saveFile(borrowers);
};

getBorrowers();
