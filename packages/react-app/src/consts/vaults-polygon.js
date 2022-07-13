import { ASSETS, ASSET_NAME } from './assets-polygon';
import { PROVIDER_TYPE, PROVIDERS } from './providers';

const VAULTS_NAMES = {
  // VaultMATICDAI: 'VaultMATICDAI',
  // VaultMATICUSDC: 'VaultMATICUSDC',
  // VaultWBTCDAI: 'VaultWBTCDAI',
  VaultWBTCUSDC: 'VaultWBTCUSDC',
  // VaultWETHDAI: 'VaultWETHDAI',
  VaultWETHUSDC: 'VaultWETHUSDC',
  VaultUSDCWETH: 'VaultUSDCWETH',
  VaultUSDCWBTC: 'VaultUSDCWBTC'
};

const COLLATERAL_IDS = {
  // [VAULTS_NAMES.VaultMATICDAI]: 0,
  // [VAULTS_NAMES.VaultMATICUSDC]: 2,
  // [VAULTS_NAMES.VaultWBTCDAI]: 4,
  [VAULTS_NAMES.VaultWBTCUSDC]: 6,
  // [VAULTS_NAMES.VaultWETHDAI]: 8,
  [VAULTS_NAMES.VaultWETHUSDC]: 10,
  [VAULTS_NAMES.VaultUSDCWETH]: 16,
  [VAULTS_NAMES.VaultUSDCWBTC]: 18,
};

const BORROW_IDS = {
  // [VAULTS_NAMES.VaultMATICDAI]: 1,
  // [VAULTS_NAMES.VaultMATICUSDC]: 3,
  // [VAULTS_NAMES.VaultWBTCDAI]: 5,
  [VAULTS_NAMES.VaultWBTCUSDC]: 7,
  // [VAULTS_NAMES.VaultWETHDAI]: 9,
  [VAULTS_NAMES.VaultWETHUSDC]: 11,
  [VAULTS_NAMES.VaultUSDCWETH]: 17,
  [VAULTS_NAMES.VaultUSDCWBTC]: 19
};

const VAULTS = {
  // [VAULTS_NAMES.VaultMATICDAI]: {
  //   borrowAsset: ASSETS[ASSET_NAME.DAI],
  //   collateralAsset: ASSETS[ASSET_NAME.MATIC],
  //   borrowId: BORROW_IDS[VAULTS_NAMES.VaultMATICDAI],
  //   collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultMATICDAI],
  //   providers: [
  //     PROVIDERS[PROVIDER_TYPE.AAVE],
  //     PROVIDERS[PROVIDER_TYPE.AAVE_V3],
  //   ],
  //   name: 'VaultMATICDAI',
  //   title: 'MATIC-DAI',
  //   threshold: 60,
  // },
    // [VAULTS_NAMES.VaultMATICUSDC]: {
  //   borrowAsset: ASSETS[ASSET_NAME.USDC],
  //   collateralAsset: ASSETS[ASSET_NAME.MATIC],
  //   borrowId: BORROW_IDS[VAULTS_NAMES.VaultMATICUSDC],
  //   collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultMATICUSDC],
  //   providers: [
  //     PROVIDERS[PROVIDER_TYPE.AAVE],
  //     PROVIDERS[PROVIDER_TYPE.AAVE_V3],
  //   ],
  //   name: 'VaultMATICUSDC',
  //   title: 'MATIC-USDC',
  //   threshold: 60,
  // },
  // [VAULTS_NAMES.VaultWBTCDAI]: {
  //   borrowAsset: ASSETS[ASSET_NAME.DAI],
  //   collateralAsset: ASSETS[ASSET_NAME.BTC],
  //   borrowId: BORROW_IDS[VAULTS_NAMES.VaultWBTCDAI],
  //   collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultWBTCDAI],
  //   providers: [
  //     PROVIDERS[PROVIDER_TYPE.AAVE],
  //     PROVIDERS[PROVIDER_TYPE.AAVE_V3],
  //   ],
  //   name: 'VaultWBTCDAI',
  //   title: 'BTC-DAI',
  //   threshold: 65,
  // },
  [VAULTS_NAMES.VaultWBTCUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.BTC],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultWBTCUSDC],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultWBTCUSDC],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.AAVE_V3],
    ],
    name: 'VaultWBTCUSDC',
    title: 'BTC-USDC',
    threshold: 65,
  },
  // [VAULTS_NAMES.VaultWETHDAI]: {
  //   borrowAsset: ASSETS[ASSET_NAME.DAI],
  //   collateralAsset: ASSETS[ASSET_NAME.ETH],
  //   borrowId: BORROW_IDS[VAULTS_NAMES.VaultWETHDAI],
  //   collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultWETHDAI],
  //   providers: [
  //     PROVIDERS[PROVIDER_TYPE.AAVE],
  //     PROVIDERS[PROVIDER_TYPE.AAVE_V3],
  //   ],
  //   name: 'VaultWETHDAI',
  //   title: 'ETH-DAI',
  //   threshold: 75,
  // },
  [VAULTS_NAMES.VaultWETHUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultWETHUSDC],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultWETHUSDC],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.AAVE_V3],
    ],
    name: 'VaultWETHUSDC',
    title: 'ETH-USDC',
    threshold: 75,
  },
  [VAULTS_NAMES.VaultUSDCWETH]: {
    borrowAsset: ASSETS[ASSET_NAME.ETH],
    collateralAsset: ASSETS[ASSET_NAME.USDC],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultUSDCWETH],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultUSDCWETH],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.AAVE_V3],
    ],
    name: 'VaultUSDCWETH',
    title: 'USDC-ETH',
    threshold: 75,
  },
  [VAULTS_NAMES.VaultUSDCWBTC]: {
    borrowAsset: ASSETS[ASSET_NAME.BTC],
    collateralAsset: ASSETS[ASSET_NAME.USDC],
    borrowId: BORROW_IDS[VAULTS_NAMES.VaultUSDCWBTC],
    collateralId: COLLATERAL_IDS[VAULTS_NAMES.VaultUSDCWBTC],
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.AAVE_V3],
    ],
    name: 'VaultUSDCWBTC',
    title: 'USDC-BTC',
    threshold: 75,
  },
};

export { VAULTS_NAMES, BORROW_IDS, COLLATERAL_IDS, VAULTS };
