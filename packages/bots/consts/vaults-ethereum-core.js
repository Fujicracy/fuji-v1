import { ASSETS, ASSET_NAME } from './assets.js';
import { PROVIDER_TYPE, PROVIDERS } from './providers-ethereum-core.js';

const assets = ASSETS.ethereum;
const assetName = ASSET_NAME.ethereum;

const VAULTS = {
  VaultETHDAI: {
    address: '0x6E16394cBF840fc599FA3d9e5D1E90949c32a4F5',
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
    address: '0xd0dc4Cc10fCf3fEe2bF5310c0E4e097b60F097D3',
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
    address: '0xCA26d96B45111A130AF78D69E1DB283975547D67',
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
