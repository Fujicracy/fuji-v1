import { ASSETS, ASSET_NAME } from './assets-ethereum';
import { PROVIDER_TYPE, PROVIDERS } from './providers';

const VAULTS_NAMES = {
  VaultETHDAI: 'VaultETHDAI',
  VaultETHUSDC: 'VaultETHUSDC',
  VaultETHUSDT: 'VaultETHUSDT',
};

const COLLATERAL_IDS = {
  [VAULTS_NAMES.VaultETHDAI]: 0,
  [VAULTS_NAMES.VaultETHUSDC]: 2,
  [VAULTS_NAMES.VaultETHUSDT]: 4,
};

const BORROW_IDS = {
  [VAULTS_NAMES.VaultETHDAI]: 1,
  [VAULTS_NAMES.VaultETHUSDC]: 3,
  [VAULTS_NAMES.VaultETHUSDT]: 5,
};

const VAULTS = {
  [VAULTS_NAMES.VaultETHDAI]: {
    borrowAsset: ASSETS[ASSET_NAME.DAI],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultETHDAI],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultETHDAI],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
    name: 'VaultETHDAI',
    title: 'ETH-DAI',
    threshold: 75,
  },
  [VAULTS_NAMES.VaultETHUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultETHUSDC],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultETHUSDC],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
    name: 'VaultETHUSDC',
    title: 'ETH-USDC',
    threshold: 75,
  },
  [VAULTS_NAMES.VaultETHUSDT]: {
    borrowAsset: ASSETS[ASSET_NAME.USDT],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultETHUSDT],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultETHUSDT],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
    name: 'VaultETHUSDT',
    title: 'ETH-USDT',
    threshold: 75,
  },
};

export { VAULTS_NAMES, BORROW_IDS, COLLATERAL_IDS, VAULTS };
