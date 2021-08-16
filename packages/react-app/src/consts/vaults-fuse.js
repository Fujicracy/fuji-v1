import { getContractAddress } from 'helpers';
import { ASSETS, ASSET_NAME } from './assets';
import { PROVIDER_TYPE, PROVIDERS } from './providers';

const VAULTS_ADDRESS = {
  VaultETHFEI: getContractAddress('VaultETHFEI'),
  VaultETHUSDC: getContractAddress('VaultETHUSDC'),
};

const COLLATERAL_IDS = {
  [VAULTS_ADDRESS.VaultETHFEI]: 0,
  [VAULTS_ADDRESS.VaultETHUSDC]: 2,
};

const BORROW_IDS = {
  [VAULTS_ADDRESS.VaultETHFEI]: 1,
  [VAULTS_ADDRESS.VaultETHUSDC]: 3,
};

const VAULTS = {
  [VAULTS_ADDRESS.VaultETHFEI]: {
    borrowAsset: ASSETS[ASSET_NAME.FEI],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_ADDRESS.VaultETHFEI],
    collateralId: COLLATERAL_IDS[VAULTS_ADDRESS.VaultETHFEI],
    providers: [
      PROVIDERS[PROVIDER_TYPE.FUSE6],
      PROVIDERS[PROVIDER_TYPE.FUSE7],
      PROVIDERS[PROVIDER_TYPE.FUSE8],
      PROVIDERS[PROVIDER_TYPE.FUSE18],
    ],
    name: 'VaultETHFEI',
    title: 'ETH-FEI',
  },
  [VAULTS_ADDRESS.VaultETHUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_ADDRESS.VaultETHUSDC],
    collateralId: COLLATERAL_IDS[VAULTS_ADDRESS.VaultETHUSDC],
    providers: [
      PROVIDERS[PROVIDER_TYPE.FUSE3],
      PROVIDERS[PROVIDER_TYPE.FUSE6],
      PROVIDERS[PROVIDER_TYPE.FUSE7],
      PROVIDERS[PROVIDER_TYPE.FUSE18],
    ],
    name: 'VaultETHUSDC',
    title: 'ETH-USDC',
  },
};

export { VAULTS_ADDRESS, BORROW_IDS, COLLATERAL_IDS, VAULTS };
