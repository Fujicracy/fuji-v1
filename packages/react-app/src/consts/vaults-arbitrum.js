import { ASSETS, ASSET_NAME } from './assets-polygon';
import { PROVIDER_TYPE, PROVIDERS } from './providers';

const VAULTS_NAMES = {
  VaultETHDAI: 'VaultETHDAI',
  VaultETHUSDC: 'VaultETHUSDC',
  VaultUSDCETH: 'VaultUSDCETH',
};

const COLLATERAL_IDS = {
  [VAULTS_NAMES.VaultETHDAI]: 0,
  [VAULTS_NAMES.VaultETHUSDC]: 2,
  [VAULTS_NAMES.VaultUSDCETH]: 4,
};

const BORROW_IDS = {
  [VAULTS_NAMES.VaultETHDAI]: 1,
  [VAULTS_NAMES.VaultETHUSDC]: 3,
  [VAULTS_NAMES.VaultUSDCETH]: 5,
};

const VAULTS = {
  [VAULTS_NAMES.VaultETHDAI]: {
    borrowAsset: ASSETS[ASSET_NAME.DAI],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultETHDAI],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultETHDAI],
    providers: [PROVIDERS[PROVIDER_TYPE.AAVE_MATIC], PROVIDERS[PROVIDER_TYPE.AAVE_V3_MATIC]],
    name: 'VaultETHDAI',
    title: 'ETH-DAI',
    threshold: 75,
  },
  [VAULTS_NAMES.VaultETHUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultETHUSDC],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultETHUSDC],
    providers: [PROVIDERS[PROVIDER_TYPE.AAVE_MATIC], PROVIDERS[PROVIDER_TYPE.AAVE_V3_MATIC]],
    name: 'VaultETHUSDC',
    title: 'ETH-USDC',
    threshold: 75,
  },
  [VAULTS_NAMES.VaultUSDCWETH]: {
    borrowAsset: ASSETS[ASSET_NAME.ETH],
    collateralAsset: ASSETS[ASSET_NAME.USDC],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultUSDCWETH],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultUSDCWETH],
    providers: [PROVIDERS[PROVIDER_TYPE.AAVE_MATIC], PROVIDERS[PROVIDER_TYPE.AAVE_V3_MATIC]],
    name: 'VaultUSDCWETH',
    title: 'USDC-ETH',
    threshold: 75,
  },
};

export { VAULTS_NAMES, BORROW_IDS, COLLATERAL_IDS, VAULTS };
