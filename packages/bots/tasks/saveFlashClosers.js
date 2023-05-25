// Script that fetches borrowers from all vaults,
// sorts and filters by unique user addresses
// and creates a csv file

import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { formatUnits } from 'ethers/lib/utils.js';
import { VAULTS } from '../consts/index.js';
import { getSigner, loadContracts } from '../utils/index.js';

const searchOperations = async (contracts, vaults) => {
  const fliquidator = contracts.Fliquidator;
  const filters = fliquidator.filters.FlashClose();
  const events = await fliquidator.queryFilter(filters);

  const operations = [];

  for (let i = 0; i < events.length; i += 1) {
    const e = events[i];
    const vaultAddr = e.args.vault;
    const vault = vaults.find(v => v.address === vaultAddr);
    // ATTENTION: not working with legacy Fliquidator on Ethereum
    operations.push({
      vault: vault.name,
      userAddr: e.args.userAddr,
      amount: formatUnits(e.args.amount, vault.borrowAsset.decimals),
      asset: vault.borrowAsset.name,
    });
  }

  return operations;
};

const saveFile = operations => {
  const csvWriter = createCsvWriter({
    path: 'fuji-flashcloses.csv',
    header: [
      { id: 'vault', title: 'Vault' },
      { id: 'userAddr', title: 'User Address' },
      { id: 'amount', title: 'Amount' },
      { id: 'asset', title: 'Asset' },
    ],
  });
  csvWriter
    .writeRecords(operations)
    .then(() => console.log(`Successfully saved ${operations.length} flashcloses`));
};

const saveFlashClosers = async (config, deployment) => {
  const signer = getSigner(config);

  const contracts = await loadContracts(signer.provider, config.chainId, deployment);

  const vaults = Object.values(VAULTS[config.networkName][deployment].VAULTS);
  const operations = await searchOperations(contracts, vaults);

  saveFile(operations);
};

export { saveFlashClosers };
