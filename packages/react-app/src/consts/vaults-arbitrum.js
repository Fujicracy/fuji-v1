import { ASSETS, ASSET_NAME } from './assets-arbitrum';
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
    providers: [PROVIDERS[PROVIDER_TYPE.AAVE_V3_ARB], PROVIDERS[PROVIDER_TYPE.DFORCE_ARB]],
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
      PROVIDERS[PROVIDER_TYPE.AAVE_V3_ARB],
      PROVIDERS[PROVIDER_TYPE.DFORCE_ARB],
      PROVIDERS[PROVIDER_TYPE.WEPIGGY_ARB],
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
      PROVIDERS[PROVIDER_TYPE.AAVE_V3_ARB],
      PROVIDERS[PROVIDER_TYPE.DFORCE_ARB],
      PROVIDERS[PROVIDER_TYPE.WEPIGGY_ARB],
    ],
    name: 'VaultUSDCETH',
    title: 'USDC-ETH',
    threshold: 75,
  },
};

export { VAULTS_NAMES, BORROW_IDS, COLLATERAL_IDS, VAULTS };
