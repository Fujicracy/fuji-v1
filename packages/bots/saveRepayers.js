// Script that fetches repayers from all vaults,
// sorts and filters by unique user addresses
// and creates a csv file

import chalk from 'chalk';
import { ethers } from 'ethers';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { VAULTS_ADDRESS } from './consts/index.js';
import { getSigner, loadContracts } from './utils/index.js';

const signer = getSigner();

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
  const contracts = await loadContracts(signer.provider);

  let repayers = [];

  const vaultsList = Object.keys(VAULTS_ADDRESS);
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
