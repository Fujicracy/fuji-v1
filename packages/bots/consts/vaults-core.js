import { getContractAddress } from '../utils/index.js';
import { ASSETS, ASSET_NAME } from './assets.js';
import { PROVIDER_TYPE, PROVIDERS } from './providers.js';

const VAULTS_ADDRESS = {
  VaultETHDAI: getContractAddress('VaultETHDAI'),
  VaultETHUSDC: getContractAddress('VaultETHUSDC'),
  VaultETHUSDT: getContractAddress('VaultETHUSDT'),
};

const VAULTS = {
  [VAULTS_ADDRESS.VaultETHDAI]: {
    borrowAsset: ASSETS[ASSET_NAME.DAI],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHDAI',
    title: 'ETH-DAI',
    deployBlockNumber: 12386446,
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.DYDX],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
  [VAULTS_ADDRESS.VaultETHUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHUSDC',
    title: 'ETH-USDC',
    deployBlockNumber: 12418746,
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.DYDX],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
  [VAULTS_ADDRESS.VaultETHUSDT]: {
    borrowAsset: ASSETS[ASSET_NAME.USDT],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    title: 'ETH-USDT',
    deployBlockNumber: 12694137,
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
};

export { VAULTS_ADDRESS, VAULTS };
