// Script that fetches repayers from all vaults,
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

const searchRepayers = async (vault, searchLength) => {
  const filterRepayers = vault.filters.Payback();
  const events = await vault.queryFilter(filterRepayers, searchLength);

  const repayers = [];

  for (let i = 0; i < events.length; i += 1) {
    const e = events[i];
    const block = await e.getBlock();
    const tx = await e.getTransactionReceipt();
    repayers.push({
      vault: vault.address,
      txhash: tx.transactionHash,
      blockNumber: e.blockNumber,
      timestamp: block.timestamp,
      userAddr: e.args.userAddrs,
      amount: e.args.amount,
    });
  }

  return repayers;
};

const filterAndSort = repayers => {
  return repayers
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber))
    .reduce((acc, repayer) => {
      if (!acc.find(({ userAddr }) => repayer.userAddr === userAddr)) return [...acc, repayer];
      return acc;
    }, []);
};

const saveFile = (transactors, name) => {
  const csvWriter = createCsvWriter({
    path: `fuji-${name}.csv`,
    header: [
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'txhash', title: 'TxHash' },
      { id: 'userAddr', title: 'User Address' },
      { id: 'vault', title: 'Vault Address' },
      { id: 'amount', title: 'Amount' },
    ],
  });
  csvWriter
    .writeRecords(transactors)
    .then(() => console.log(`Successfully saved ${(transactors.length, name)}`));
};

const getRepayers = async () => {
  const contracts = await loadContracts(signer);

  console.log('contracts');
  let repayers = [];

  for (let v = 0; v < vaultsList.length; v++) {
    let vaultName = vaultsList[v];
    console.log('Searching PAYBACK positions in', chalk.blue(vaultName));

    let vault = contracts[vaultName];

    let found = await searchRepayers(vault);
    repayers.push(...found);
  }

  repayers = filterAndSort(repayers, 'repayer');
  saveFile(repayers, 'repayers');
};

getRepayers();
