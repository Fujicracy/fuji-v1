// Script that fetches repayers from all vaults,
// sorts and filters by unique user addresses
// and creates a csv file

import chalk from 'chalk';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { VAULTS } from '../consts/index.js';
import { getSigner, loadContracts } from '../utils/index.js';

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

const saveRepayers = async (config, deployment) => {
  const signer = getSigner(config);

  const contracts = await loadContracts(signer.provider, config.chainId, deployment);

  let repayers = [];

  const vaults = Object.values(VAULTS[config.networkName][deployment].VAULTS);
  for (let v = 0; v < vaults.length; v++) {
    const vaultName = vaults[v].name;
    console.log('Searching PAYBACK positions in', chalk.blue(vaultName));

    const vault = contracts[vaultName];

    const found = await searchRepayers(vault);
    repayers.push(...found);
  }

  repayers = filterAndSort(repayers, 'repayer');
  saveFile(repayers, 'repayers');
};

export { saveRepayers };
