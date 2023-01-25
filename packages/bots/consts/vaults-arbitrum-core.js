import { ASSETS, ASSET_NAME } from './assets.js';
import { PROVIDER_TYPE, PROVIDERS } from './providers-arbitrum-core.js';

const assets = ASSETS.arbitrum;
const assetName = ASSET_NAME.arbitrum;

const VAULTS = {
  VaultETHDAI: {
    collateralAsset: assets[assetName.ETH],
    borrowAsset: assets[assetName.DAI],
    providers: [PROVIDERS[PROVIDER_TYPE.AAVE_V3_ARB], PROVIDERS[PROVIDER_TYPE.DFORCE_ARB]],
    name: 'VaultETHDAI',
    deployBlockNumber: 19224015,
    refinanceConfig: {
      thresholdAPR: 1,
      hoursSinceLast: 24,
    },
  },
  VaultETHUSDC: {
    collateralAsset: assets[assetName.ETH],
    borrowAsset: assets[assetName.USDC],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE_V3_ARB],
      PROVIDERS[PROVIDER_TYPE.DFORCE_ARB],
      PROVIDERS[PROVIDER_TYPE.WEPIGGY_ARB],
    ],
    name: 'VaultETHUSDC',
    deployBlockNumber: 19224020,
    refinanceConfig: {
      thresholdAPR: 1,
      hoursSinceLast: 24,
    },
  },
  VaultUSDCETH: {
    collateralAsset: assets[assetName.USDC],
    borrowAsset: assets[assetName.ETH],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE_V3_ARB],
      PROVIDERS[PROVIDER_TYPE.DFORCE_ARB],
      PROVIDERS[PROVIDER_TYPE.WEPIGGY_ARB],
    ],
    name: 'VaultUSDCETH',
    deployBlockNumber: 19224023,
    refinanceConfig: {
      thresholdAPR: 1,
      hoursSinceLast: 24,
    },
  },
};

export { VAULTS };
