import { getContractAddress } from '../utils/index.js';
import { ASSETS, ASSET_NAME } from './assets.js';
import { PROVIDER_TYPE, PROVIDERS } from './providers.js';

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
    providers: [
      PROVIDERS[PROVIDER_TYPE.FUSE6],
      PROVIDERS[PROVIDER_TYPE.FUSE7],
      PROVIDERS[PROVIDER_TYPE.FUSE8],
      PROVIDERS[PROVIDER_TYPE.FUSE18],
    ],
  },
  [VAULTS_ADDRESS.VaultETHUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHUSDC',
    deployBlockNumber: 13107987,
    providers: [
      PROVIDERS[PROVIDER_TYPE.FUSE3],
      PROVIDERS[PROVIDER_TYPE.FUSE6],
      PROVIDERS[PROVIDER_TYPE.FUSE7],
      PROVIDERS[PROVIDER_TYPE.FUSE18],
    ],
  },
};

export { VAULTS_ADDRESS, VAULTS };
