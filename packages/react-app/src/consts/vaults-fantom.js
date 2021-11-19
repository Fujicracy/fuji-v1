import { getContractAddress } from 'helpers';
import { ASSETS, ASSET_NAME } from './assets-fantom';
import { PROVIDER_TYPE, PROVIDERS } from './providers';

const VAULTS_ADDRESS = {
  VaultFTMDAI: getContractAddress('VaultFTMDAI'),
  VaultFTMUSDC: getContractAddress('VaultFTMUSDC'),
  VaultWBTCDAI: getContractAddress('VaultWBTCDAI'),
};

const COLLATERAL_IDS = {
  [VAULTS_ADDRESS.VaultFTMDAI]: 0,
  [VAULTS_ADDRESS.VaultFTMUSDC]: 2,
  [VAULTS_ADDRESS.VaultWBTCDAI]: 4,
};

const BORROW_IDS = {
  [VAULTS_ADDRESS.VaultFTMDAI]: 1,
  [VAULTS_ADDRESS.VaultFTMUSDC]: 3,
  [VAULTS_ADDRESS.VaultWBTCDAI]: 5,
};

const VAULTS = {
  [VAULTS_ADDRESS.VaultFTMDAI]: {
    borrowAsset: ASSETS[ASSET_NAME.DAI],
    collateralAsset: ASSETS[ASSET_NAME.FTM],
    borrowId: BORROW_IDS[VAULTS_ADDRESS.VaultFTMDAI],
    collateralId: COLLATERAL_IDS[VAULTS_ADDRESS.VaultFTMDAI],
    providers: [
      PROVIDERS[PROVIDER_TYPE.GEIST],
      PROVIDERS[PROVIDER_TYPE.SCREAM],
      PROVIDERS[PROVIDER_TYPE.CREAM],
    ],
    name: 'VaultFTMDAI',
    title: 'FTM-DAI',
    threshold: 45,
  },
  [VAULTS_ADDRESS.VaultFTMUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.FTM],
    borrowId: BORROW_IDS[VAULTS_ADDRESS.VaultFTMUSDC],
    collateralId: COLLATERAL_IDS[VAULTS_ADDRESS.VaultFTMUSDC],
    providers: [
      PROVIDERS[PROVIDER_TYPE.GEIST],
      PROVIDERS[PROVIDER_TYPE.SCREAM],
      PROVIDERS[PROVIDER_TYPE.CREAM],
    ],
    name: 'VaultFTMUSDC',
    title: 'FTM-USDC',
    threshold: 45,
  },
  [VAULTS_ADDRESS.VaultWBTCDAI]: {
    borrowAsset: ASSETS[ASSET_NAME.DAI],
    collateralAsset: ASSETS[ASSET_NAME.BTC],
    borrowId: BORROW_IDS[VAULTS_ADDRESS.VaultWBTCDAI],
    collateralId: COLLATERAL_IDS[VAULTS_ADDRESS.VaultWBTCDAI],
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

export { VAULTS_ADDRESS, BORROW_IDS, COLLATERAL_IDS, VAULTS };
