// Script that fetches borrowers from all vaults,
// sorts and filters by unique user addresses
// and creates a csv file

import chalk from 'chalk';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { formatUnits } from 'ethers/lib/utils.js';
import { VAULTS } from '../consts/index.js';
import { getSigner, loadContracts } from '../utils/index.js';

const searchBorrowers = async (vaultContract, vault) => {
  const filterBorrowers = vaultContract.filters.Borrow();
  const events = await vaultContract.queryFilter(filterBorrowers, vaultContract.deployBlockNumber);
  const borrowers = [];
  for (let i = 0; i < events.length; i += 1) {
    const e = events[i];
    borrowers.push({
      vault: vault.name,
      userAddr: e.args.userAddrs,
      amount: formatUnits(e.args.amount, vault.borrowAsset.decimals),
      asset: vault.borrowAsset.name,
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
      { id: 'vault', title: 'Vault' },
      { id: 'userAddr', title: 'User Address' },
      { id: 'amount', title: 'Amount' },
      { id: 'asset', title: 'Asset' },
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
    const vaultContract = contracts[vaultName];
    const found = await searchBorrowers(vaultContract, vaults[v]);
    borrowers.push(...found);
  }
  borrowers = filterAndSort(borrowers);
  saveFile(borrowers);
};

export { saveBorrowers };
