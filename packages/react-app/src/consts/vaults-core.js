import { getContractAddress } from 'helpers';
import { ASSETS, ASSET_NAME } from './assets';
import { PROVIDER_TYPE, PROVIDERS } from './providers';

const VAULTS_ADDRESS = {
  VaultETHDAI: getContractAddress('VaultETHDAI'),
  VaultETHUSDC: getContractAddress('VaultETHUSDC'),
  VaultETHUSDT: getContractAddress('VaultETHUSDT'),

  VaultDAIETH: getContractAddress('VaultDAIETH'),
  VaultUSDCETH: getContractAddress('VaultUSDCETH'),
  VaultUSDTETH: getContractAddress('VaultUSDTETH'),
};

const COLLATERAL_IDS = {
  [VAULTS_ADDRESS.VaultETHDAI]: 0,
  [VAULTS_ADDRESS.VaultETHUSDC]: 2,
  [VAULTS_ADDRESS.VaultETHUSDT]: 4,
  [VAULTS_ADDRESS.VaultDAIETH]: 6,
  [VAULTS_ADDRESS.VaultUSDCETH]: 8,
  [VAULTS_ADDRESS.VaultUSDTETH]: 10,
};

const BORROW_IDS = {
  [VAULTS_ADDRESS.VaultETHDAI]: 1,
  [VAULTS_ADDRESS.VaultETHUSDC]: 3,
  [VAULTS_ADDRESS.VaultETHUSDT]: 5,
  [VAULTS_ADDRESS.VaultDAIETH]: 7,
  [VAULTS_ADDRESS.VaultUSDCETH]: 9,
  [VAULTS_ADDRESS.VaultUSDTETH]: 11,
};

const VAULTS = {
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

  [VAULTS_ADDRESS.VaultDAIETH]: {
    borrowAsset: ASSETS[ASSET_NAME.ETH],
    collateralAsset: ASSETS[ASSET_NAME.DAI],
    borrowId: BORROW_IDS[VAULTS_ADDRESS.VaultDAIETH],
    collateralId: COLLATERAL_IDS[VAULTS_ADDRESS.VaultDAIETH],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.DYDX],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
    isCollateralERC20: true,
    name: 'VaultDAIETH',
    title: 'DAI-ETH',
  },
  [VAULTS_ADDRESS.VaultUSDCETH]: {
    borrowAsset: ASSETS[ASSET_NAME.ETH],
    collateralAsset: ASSETS[ASSET_NAME.USDC],
    borrowId: BORROW_IDS[VAULTS_ADDRESS.VaultUSDCETH],
    collateralId: COLLATERAL_IDS[VAULTS_ADDRESS.VaultUSDCETH],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.DYDX],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
    isCollateralERC20: true,
    name: 'VaultUSDCETH',
    title: 'USDC-ETH',
  },
  [VAULTS_ADDRESS.VaultUSDTETH]: {
    borrowAsset: ASSETS[ASSET_NAME.ETH],
    collateralAsset: ASSETS[ASSET_NAME.USDT],
    borrowId: BORROW_IDS[VAULTS_ADDRESS.VaultUSDTETH],
    collateralId: COLLATERAL_IDS[VAULTS_ADDRESS.VaultUSDTETH],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
    isCollateralERC20: true,
    name: 'VaultUSDTETH',
    title: 'USDT-ETH',
  },
};

export { VAULTS_ADDRESS, BORROW_IDS, COLLATERAL_IDS, VAULTS };
