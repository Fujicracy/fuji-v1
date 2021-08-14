import { getVaultAddress } from 'helpers';
import { ASSETS, ASSET_NAME } from './assets';
import { PROVIDER_TYPE, PROVIDERS } from './providers';

export const VAULTS_ADDRESS = {
  VaultETHDAI: getVaultAddress('VaultETHDAI'),
  VaultETHUSDC: getVaultAddress('VaultETHUSDC'),
  VaultETHUSDT: getVaultAddress('VaultETHUSDT'),
};

const COLLATERAL_IDS = {
  [VAULTS_ADDRESS.VaultETHDAI]: 0,
  [VAULTS_ADDRESS.VaultETHUSDC]: 2,
  [VAULTS_ADDRESS.VaultETHUSDT]: 4,
};

const BORROW_IDS = {
  [VAULTS_ADDRESS.VaultETHDAI]: 1,
  [VAULTS_ADDRESS.VaultETHUSDC]: 3,
  [VAULTS_ADDRESS.VaultETHUSDT]: 5,
};

export const VAULTS = {
  [VAULTS_ADDRESS.VaultETHDAI]: {
    borrowAsset: ASSETS[ASSET_NAME.DAI],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_ADDRESS.VaultETHDAI],
    collateralId: COLLATERAL_IDS[VAULTS_ADDRESS.VaultETHDAI],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.DYDX],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
    name: 'VaultETHDAI',
    title: 'ETH-DAI',
  },
  [VAULTS_ADDRESS.VaultETHUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_ADDRESS.VaultETHUSDC],
    collateralId: COLLATERAL_IDS[VAULTS_ADDRESS.VaultETHUSDC],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.DYDX],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
    name: 'VaultETHUSDC',
    title: 'ETH-USDC',
  },
  [VAULTS_ADDRESS.VaultETHUSDT]: {
    borrowAsset: ASSETS[ASSET_NAME.USDT],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_ADDRESS.VaultETHUSDT],
    collateralId: COLLATERAL_IDS[VAULTS_ADDRESS.VaultETHUSDT],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
    name: 'VaultETHUSDT',
    title: 'ETH-USDT',
  },
};
