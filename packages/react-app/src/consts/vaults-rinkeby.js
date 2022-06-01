import { ASSETS, ASSET_NAME } from './assets-rinkeby';
import { PROVIDER_TYPE, PROVIDERS } from './providers';

const VAULTS_NAMES = {
  VaultDAIUSDC: 'VaultDAIUSDC',
};

const COLLATERAL_IDS = {
  [VAULTS_NAMES.VaultDAIUSDC]: 0,
};

const BORROW_IDS = {
  [VAULTS_NAMES.VaultDAIUSDC]: 1,
};

const VAULTS = {
  [VAULTS_NAMES.VaultDAIUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.DAI],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultDAIUSDC],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultDAIUSDC],
    providers: [PROVIDERS[PROVIDER_TYPE.COMPOUND_MOCK]],
    name: 'VaultDAIUSDC',
    title: 'DAI-USDC',
    threshold: 75,
  },
};

export { VAULTS_NAMES, BORROW_IDS, COLLATERAL_IDS, VAULTS };
