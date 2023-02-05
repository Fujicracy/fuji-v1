import { ASSETS, ASSET_NAME } from './assets.js';
import { PROVIDER_TYPE, PROVIDERS } from './providers-fantom-core.js';

const assets = ASSETS.fantom;
const assetName = ASSET_NAME.fantom;

const VAULTS = {
  VaultFTMDAI: {
    address: '0x67908BE314DE4A16AD34f401f5d99e061DFE7334',
    collateralAsset: assets[assetName.FTM],
    borrowAsset: assets[assetName.DAI],
    name: 'VaultFTMDAI',
    deployBlockNumber: 19246494,
    refinanceConfig: {
      thresholdAPR: 1,
      hoursSinceLast: 24,
    },
    providers: [
      PROVIDERS[PROVIDER_TYPE.GEIST],
      PROVIDERS[PROVIDER_TYPE.CREAM],
      PROVIDERS[PROVIDER_TYPE.HUNDRED],
    ],
  },
  VaultFTMUSDC: {
    address: '0x085a99366861bd9c0B040b8Ad3882ab44327617e',
    collateralAsset: assets[assetName.FTM],
    borrowAsset: assets[assetName.USDC],
    name: 'VaultFTMUSDC',
    deployBlockNumber: 19246736,
    refinanceConfig: {
      thresholdAPR: 1,
      hoursSinceLast: 24,
    },
    providers: [
      PROVIDERS[PROVIDER_TYPE.GEIST],
      PROVIDERS[PROVIDER_TYPE.CREAM],
      PROVIDERS[PROVIDER_TYPE.HUNDRED],
    ],
  },
  VaultWBTCDAI: {
    address: '0xcb2A80380206c5bF2AAd4A0fAB2b2C31A59C208B',
    collateralAsset: assets[assetName.BTC],
    borrowAsset: assets[assetName.DAI],
    name: 'VaultWBTCDAI',
    deployBlockNumber: 19428442,
    refinanceConfig: {
      thresholdAPR: 1,
      hoursSinceLast: 24,
    },
    providers: [
      PROVIDERS[PROVIDER_TYPE.GEIST],
      PROVIDERS[PROVIDER_TYPE.CREAM],
      PROVIDERS[PROVIDER_TYPE.HUNDRED],
    ],
  },
  VaultWETHUSDC: {
    address: '0x1bAc9447611b5d1D763906dC60269Ac61E04CD4B',
    collateralAsset: assets[assetName.ETH],
    borrowAsset: assets[assetName.USDC],
    name: 'VaultWETHUSDC',
    deployBlockNumber: 23503564,
    refinanceConfig: {
      thresholdAPR: 1,
      hoursSinceLast: 24,
    },
    providers: [
      PROVIDERS[PROVIDER_TYPE.GEIST],
      PROVIDERS[PROVIDER_TYPE.CREAM],
      PROVIDERS[PROVIDER_TYPE.HUNDRED],
    ],
  },
  VaultWETHDAI: {
    address: '0x0793Cf99906423AaF17c736dcAcBFE843931686a',
    collateralAsset: assets[assetName.ETH],
    borrowAsset: assets[assetName.DAI],
    name: 'VaultWETHDAI',
    deployBlockNumber: 23791628,
    refinanceConfig: {
      thresholdAPR: 1,
      hoursSinceLast: 24,
    },
    providers: [
      PROVIDERS[PROVIDER_TYPE.GEIST],
      PROVIDERS[PROVIDER_TYPE.CREAM],
      PROVIDERS[PROVIDER_TYPE.HUNDRED],
    ],
  },
};

export { VAULTS };
