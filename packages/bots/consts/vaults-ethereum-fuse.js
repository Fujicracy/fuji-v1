import { ASSETS, ASSET_NAME } from './assets.js';
import { PROVIDER_TYPE, PROVIDERS } from './providers.js';

const VAULTS = {
  VaultETHFEI: {
    borrowAsset: ASSETS[ASSET_NAME.FEI],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHFEI',
    deployBlockNumber: 13107920,
    providers: [
      PROVIDERS[PROVIDER_TYPE.FUSE6],
      PROVIDERS[PROVIDER_TYPE.FUSE7],
      PROVIDERS[PROVIDER_TYPE.FUSE8],
      PROVIDERS[PROVIDER_TYPE.FUSE18],
    ],
  },
  VaultETHUSDC: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHUSDC',
    deployBlockNumber: 13107987,
    providers: [
      PROVIDERS[PROVIDER_TYPE.FUSE3],
      PROVIDERS[PROVIDER_TYPE.FUSE6],
      PROVIDERS[PROVIDER_TYPE.FUSE7],
      PROVIDERS[PROVIDER_TYPE.FUSE18],
    ],
  },
};

export { VAULTS };
