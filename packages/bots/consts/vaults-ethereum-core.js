import { ASSETS, ASSET_NAME } from './assets.js';
import { PROVIDER_TYPE, PROVIDERS } from './providers.js';

const assets = ASSETS.ethereum;
const assetName = ASSET_NAME.ethereum;

const VAULTS = {
  VaultETHDAI: {
    collateralAsset: assets[assetName.ETH],
    borrowAsset: assets[assetName.DAI],
    name: 'VaultETHDAI',
    deployBlockNumber: 12386446,
    refinanceConfig: {
      thresholdAPR: 1.5,
      hoursSinceLast: 24,
    },
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
  VaultETHUSDC: {
    collateralAsset: assets[assetName.ETH],
    borrowAsset: assets[assetName.USDC],
    name: 'VaultETHUSDC',
    deployBlockNumber: 12418746,
    refinanceConfig: {
      thresholdAPR: 1.5,
      hoursSinceLast: 24,
    },
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
  VaultETHUSDT: {
    collateralAsset: assets[assetName.ETH],
    borrowAsset: assets[assetName.USDT],
    name: 'VaultETHUSDT',
    deployBlockNumber: 12694137,
    refinanceConfig: {
      thresholdAPR: 2,
      hoursSinceLast: 24,
    },
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
};

export { VAULTS };
