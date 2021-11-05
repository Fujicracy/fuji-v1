import { ASSETS, ASSET_NAME } from './assets.js';
import { PROVIDER_TYPE, PROVIDERS } from './providers.js';

const assets = ASSETS.fantom;
const assetName = ASSET_NAME.fantom;

const VAULTS = {
  VaultFTMDAI: {
    collateralAsset: assets[assetName.FTM],
    borrowAsset: assets[assetName.DAI],
    name: 'VaultFTMDAI',
    deployBlockNumber: 19246494,
    refinanceConfig: {
      thresholdAPR: 3,
      hoursSinceLast: 24,
    },
    providers: [
      PROVIDERS[PROVIDER_TYPE.GEIST],
      PROVIDERS[PROVIDER_TYPE.SCREAM],
      PROVIDERS[PROVIDER_TYPE.CREAM],
    ],
  },
  VaultFTMUSDC: {
    collateralAsset: assets[assetName.FTM],
    borrowAsset: assets[assetName.USDC],
    name: 'VaultFTMUSDC',
    deployBlockNumber: 19246736,
    refinanceConfig: {
      thresholdAPR: 3,
      hoursSinceLast: 24,
    },
    providers: [
      PROVIDERS[PROVIDER_TYPE.GEIST],
      PROVIDERS[PROVIDER_TYPE.SCREAM],
      PROVIDERS[PROVIDER_TYPE.CREAM],
    ],
  },
  VaultWBTCDAI: {
    collateralAsset: assets[assetName.BTC],
    borrowAsset: assets[assetName.DAI],
    name: 'VaultWBTCDAI',
    deployBlockNumber: 19428442,
    refinanceConfig: {
      thresholdAPR: 3,
      hoursSinceLast: 24,
    },
    providers: [
      PROVIDERS[PROVIDER_TYPE.GEIST],
      PROVIDERS[PROVIDER_TYPE.SCREAM],
      PROVIDERS[PROVIDER_TYPE.CREAM],
    ]
  },
};

export { VAULTS };
