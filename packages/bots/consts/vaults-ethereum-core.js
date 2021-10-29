import { ASSETS, ASSET_NAME } from './assets.js';
import { PROVIDER_TYPE, PROVIDERS } from './providers.js';

const VAULTS = {
  VaultETHDAI: {
    borrowAsset: ASSETS[ASSET_NAME.DAI],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHDAI',
    deployBlockNumber: 12386446,
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.DYDX],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
  VaultETHUSDC: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHUSDC',
    deployBlockNumber: 12418746,
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.DYDX],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
  VaultETHUSDT: {
    borrowAsset: ASSETS[ASSET_NAME.USDT],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHUSDT',
    deployBlockNumber: 12694137,
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
};

export { VAULTS };
