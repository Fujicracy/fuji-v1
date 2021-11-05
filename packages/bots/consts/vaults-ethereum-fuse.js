import { ASSETS, ASSET_NAME } from './assets.js';
import { PROVIDER_TYPE, PROVIDERS } from './providers.js';

const assets = ASSETS.ethereum;
const assetName = ASSET_NAME.ethereum;

const VAULTS = {
  VaultETHFEI: {
    collateralAsset: assets[assetName.ETH],
    borrowAsset: assets[assetName.FEI],
    name: 'VaultETHFEI',
    deployBlockNumber: 13107920,
    refinanceConfig: {
      thresholdAPR: 4,
      hoursSinceLast: 24,
    },
    providers: [
      PROVIDERS[PROVIDER_TYPE.FUSE6],
      PROVIDERS[PROVIDER_TYPE.FUSE7],
      PROVIDERS[PROVIDER_TYPE.FUSE8],
      PROVIDERS[PROVIDER_TYPE.FUSE18],
    ],
  },
  VaultETHUSDC: {
    collateralAsset: assets[assetName.ETH],
    borrowAsset: assets[assetName.USDC],
    name: 'VaultETHUSDC',
    deployBlockNumber: 13107987,
    refinanceConfig: {
      thresholdAPR: 4,
      hoursSinceLast: 24,
    },
    providers: [
      PROVIDERS[PROVIDER_TYPE.FUSE3],
      PROVIDERS[PROVIDER_TYPE.FUSE6],
      PROVIDERS[PROVIDER_TYPE.FUSE7],
      PROVIDERS[PROVIDER_TYPE.FUSE18],
    ],
  },
};

export { VAULTS };
