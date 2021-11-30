import { ASSETS, ASSET_NAME } from './assets-ethereum';
import { PROVIDER_TYPE, PROVIDERS } from './providers';

const VAULTS_NAMES = {
  VaultETHFEI: 'VaultETHFEI',
  VaultETHUSDC: 'VaultETHUSDC',
};

const COLLATERAL_IDS = {
  [VAULTS_NAMES.VaultETHFEI]: 0,
  [VAULTS_NAMES.VaultETHUSDC]: 2,
};

const BORROW_IDS = {
  [VAULTS_NAMES.VaultETHFEI]: 1,
  [VAULTS_NAMES.VaultETHUSDC]: 3,
};

const VAULTS = {
  [VAULTS_NAMES.VaultETHFEI]: {
    borrowAsset: ASSETS[ASSET_NAME.FEI],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultETHFEI],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultETHFEI],
    providers: [
      PROVIDERS[PROVIDER_TYPE.FUSE6],
      PROVIDERS[PROVIDER_TYPE.FUSE7],
      PROVIDERS[PROVIDER_TYPE.FUSE8],
      PROVIDERS[PROVIDER_TYPE.FUSE18],
    ],
    name: 'VaultETHFEI',
    title: 'ETH-FEI',
    threshold: 75,
  },
  [VAULTS_NAMES.VaultETHUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultETHUSDC],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultETHUSDC],
    providers: [
      PROVIDERS[PROVIDER_TYPE.FUSE3],
      PROVIDERS[PROVIDER_TYPE.FUSE6],
      PROVIDERS[PROVIDER_TYPE.FUSE7],
      PROVIDERS[PROVIDER_TYPE.FUSE18],
    ],
    name: 'VaultETHUSDC',
    title: 'ETH-USDC',
    threshold: 75,
  },
};

export { VAULTS_NAMES, BORROW_IDS, COLLATERAL_IDS, VAULTS };
