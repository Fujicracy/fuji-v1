// Script that fetches borrowers from all vaults,
// sorts and filters by unique user addresses
// and creates a csv file

import chalk from 'chalk';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { VAULTS } from '../consts/index.js';
import { getSigner, loadContracts } from '../utils/index.js';

const searchBorrowers = async (vault, searchLength) => {
  const filterBorrowers = vault.filters.Borrow();
  const events = await vault.queryFilter(filterBorrowers, searchLength);
  const borrowers = [];
  for (let i = 0; i < events.length; i += 1) {
    const e = events[i];
    const block = await e.getBlock();
    const tx = await e.getTransactionReceipt();
    borrowers.push({
      vault: vault.address,
      txhash: tx.transactionHash,
      blockNumber: e.blockNumber,
      timestamp: block.timestamp,
      userAddr: e.args.userAddrs,
      amount: e.args.amount,
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
      { id: 'txhash', title: 'TxHash' },
      { id: 'userAddr', title: 'User Address' },
      { id: 'vault', title: 'Vault Address' },
      { id: 'amount', title: 'Amount' },
    ],
  });
  csvWriter
    .writeRecords(borrowers)
    .then(() => console.log(`Successfully saved ${borrowers.length} borrowers`));
};

const saveBorrowers = async (config, deployment) => {
  const signer = getSigner(config);

  const contracts = await loadContracts(signer.provider, config.chainId, deployment);

  let borrowers = [];

  const vaults = Object.values(VAULTS[config.networkName][deployment].VAULTS);
  for (let v = 0; v < vaults.length; v++) {
    const vaultName = vaults[v].name;
    console.log('Searching BORROW positions in', chalk.blue(vaultName));
    const vault = contracts[vaultName];
    const found = await searchBorrowers(vault);
    borrowers.push(...found);
  }
  borrowers = filterAndSort(borrowers);
  saveFile(borrowers);
};

export { saveBorrowers };
