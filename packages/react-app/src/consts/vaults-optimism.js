import { ASSETS, ASSET_NAME } from './assets-optimism';
import { PROVIDER_TYPE, PROVIDERS } from './providers';

const VAULTS_NAMES = {
  VaultETHUSDC: 'VaultETHUSDC',
  VaultUSDCETH: 'VaultUSDCETH',
};

const COLLATERAL_IDS = {
  [VAULTS_NAMES.VaultETHUSDC]: 0,
  [VAULTS_NAMES.VaultUSDCETH]: 2,
};

const BORROW_IDS = {
  [VAULTS_NAMES.VaultETHUSDC]: 1,
  [VAULTS_NAMES.VaultUSDCETH]: 3,
};

const VAULTS = {
  [VAULTS_NAMES.VaultETHUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultETHUSDC],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultETHUSDC],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE_V3_OPT],
      PROVIDERS[PROVIDER_TYPE.DFORCE_OPT],
    ],
    name: 'VaultETHUSDC',
    title: 'ETH-USDC',
    threshold: 75,
  },
  [VAULTS_NAMES.VaultUSDCETH]: {
    borrowAsset: ASSETS[ASSET_NAME.ETH],
    collateralAsset: ASSETS[ASSET_NAME.USDC],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultUSDCETH],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultUSDCETH],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE_V3_OPT],
      PROVIDERS[PROVIDER_TYPE.DFORCE_OPT],
      PROVIDERS[PROVIDER_TYPE.WEPIGGY_OPT],
    ],
    name: 'VaultUSDCETH',
    title: 'USDC-ETH',
    threshold: 75,
  },
};

export { VAULTS_NAMES, BORROW_IDS, COLLATERAL_IDS, VAULTS };
