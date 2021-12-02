import { ASSETS, ASSET_NAME } from './assets-fantom';
import { PROVIDER_TYPE, PROVIDERS } from './providers';

const VAULTS_NAMES = {
  VaultFTMDAI: 'VaultFTMDAI',
  VaultFTMUSDC: 'VaultFTMUSDC',
  VaultWBTCDAI: 'VaultWBTCDAI',
};

const COLLATERAL_IDS = {
  [VAULTS_NAMES.VaultFTMDAI]: 0,
  [VAULTS_NAMES.VaultFTMUSDC]: 2,
  [VAULTS_NAMES.VaultWBTCDAI]: 4,
};

const BORROW_IDS = {
  [VAULTS_NAMES.VaultFTMDAI]: 1,
  [VAULTS_NAMES.VaultFTMUSDC]: 3,
  [VAULTS_NAMES.VaultWBTCDAI]: 5,
};

const VAULTS = {
  [VAULTS_NAMES.VaultFTMDAI]: {
    borrowAsset: ASSETS[ASSET_NAME.DAI],
    collateralAsset: ASSETS[ASSET_NAME.FTM],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultFTMDAI],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultFTMDAI],
    providers: [
      PROVIDERS[PROVIDER_TYPE.GEIST],
      PROVIDERS[PROVIDER_TYPE.SCREAM],
      PROVIDERS[PROVIDER_TYPE.CREAM],
    ],
    name: 'VaultFTMDAI',
    title: 'FTM-DAI',
    threshold: 45,
  },
  [VAULTS_NAMES.VaultFTMUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.FTM],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultFTMUSDC],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultFTMUSDC],
    providers: [
      PROVIDERS[PROVIDER_TYPE.GEIST],
      PROVIDERS[PROVIDER_TYPE.SCREAM],
      PROVIDERS[PROVIDER_TYPE.CREAM],
    ],
    name: 'VaultFTMUSDC',
    title: 'FTM-USDC',
    threshold: 45,
  },
  [VAULTS_NAMES.VaultWBTCDAI]: {
    borrowAsset: ASSETS[ASSET_NAME.DAI],
    collateralAsset: ASSETS[ASSET_NAME.BTC],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultWBTCDAI],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultWBTCDAI],
    providers: [
      PROVIDERS[PROVIDER_TYPE.GEIST],
      PROVIDERS[PROVIDER_TYPE.SCREAM],
      PROVIDERS[PROVIDER_TYPE.CREAM],
    ],
    name: 'VaultWBTCDAI',
    title: 'BTC-DAI',
    threshold: 65,
  },
};

export { VAULTS_NAMES, BORROW_IDS, COLLATERAL_IDS, VAULTS };
