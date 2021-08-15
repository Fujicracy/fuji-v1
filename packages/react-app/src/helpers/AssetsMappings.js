/* eslint-disable import/no-dynamic-require */
import { CHAIN_ID, DEPLOYMENT } from 'consts/globals';

const contractsData = require(`../contracts/${CHAIN_ID}-${DEPLOYMENT}.deployment.json`);

const borrowAssets = {
  DAI: 1,
  USDC: 3,
  USDT: 5,
};

export function getBorrowId(borrowAsset) {
  return borrowAssets[borrowAsset].toString();
}

const collateralsByBorrowAsset = {
  DAI: 0,
  USDC: 2,
  USDT: 4,
};

export function getCollateralId(borrowAsset) {
  return collateralsByBorrowAsset[borrowAsset].toString();
}

const vaultsByBorrowAsset = {
  DAI: 'VaultETHDAI',
  USDC: 'VaultETHUSDC',
  USDT: 'VaultETHUSDT',
};

export function getVaultName(borrowAsset) {
  return vaultsByBorrowAsset[borrowAsset];
}

export function getContractAddress(name) {
  let address = '0x';
  try {
    address = contractsData[name].address.toLowerCase();
  } catch (e) {
    console.warn(`WARNING: ${name} not found!`);
  }

  return address;
}
