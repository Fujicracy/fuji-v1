import { getContractAddress } from '../utils/index.js';
import { ASSETS, ASSET_NAME } from './assets.js';

const VAULTS_ADDRESS = {
  VaultETHFEI: getContractAddress('VaultETHFEI'),
  VaultETHUSDC: getContractAddress('VaultETHUSDC'),
};

const VAULTS = {
  [VAULTS_ADDRESS.VaultETHFEI]: {
    borrowAsset: ASSETS[ASSET_NAME.FEI],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHFEI',
    deployBlockNumber: 13107920,
  },
  [VAULTS_ADDRESS.VaultETHUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHUSDC',
    deployBlockNumber: 13107987,
  },
};

export { VAULTS_ADDRESS, VAULTS };
