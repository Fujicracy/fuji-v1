import { ASSETS, ASSET_NAME } from './assets';
import { PROVIDER_TYPE, PROVIDERS } from './providers';

const COLLATERAL_IDS = {
  [ASSET_NAME.DAI]: 0,
  [ASSET_NAME.USDC]: 2,
  [ASSET_NAME.USDT]: 4,
};

const BORROW_IDS = {
  [ASSET_NAME.DAI]: 1,
  [ASSET_NAME.USDC]: 3,
  [ASSET_NAME.USDT]: 5,
};

export const VAULTS_ADDRESS = {
  VaultETHDAI: '0x6e16394cbf840fc599fa3d9e5d1e90949c32a4f5'.toLowerCase(),
  VaultETHUSDC: '0xd0dc4cc10fcf3fee2bf5310c0e4e097b60f097d3'.toLowerCase(),
  VaultETHUSDT: '0xca26d96b45111a130af78d69e1db283975547d67'.toLowerCase(),
};

export const VAULTS = {
  [VAULTS_ADDRESS.VaultETHDAI]: {
    borrowAsset: ASSETS[ASSET_NAME.DAI],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[ASSET_NAME.DAI],
    collateralId: COLLATERAL_IDS[ASSET_NAME.DAI],
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
    borrowId: BORROW_IDS[ASSET_NAME.USDC],
    collateralId: COLLATERAL_IDS[ASSET_NAME.USDC],
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
    borrowId: BORROW_IDS[ASSET_NAME.USDT],
    collateralId: COLLATERAL_IDS[ASSET_NAME.USDT],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
    name: 'VaultETHUSDT',
    title: 'ETH-USDT',
  },
};
