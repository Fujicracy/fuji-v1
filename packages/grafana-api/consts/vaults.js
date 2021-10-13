const { ASSETS, ASSET_NAME } = require('./assets');

const VAULTS_ADDRESS = {
  VaultETHDAI_core: '0x6E16394cBF840fc599FA3d9e5D1E90949c32a4F5'.toLowerCase(),
  VaultETHUSDC_core: '0xd0dc4Cc10fCf3fEe2bF5310c0E4e097b60F097D3'.toLowerCase(),
  VaultETHUSDT_core: '0xCA26d96B45111A130AF78D69E1DB283975547D67'.toLowerCase(),
  VaultETHUSDC_fuse: '0x4F86E118C594C5DAf24f1725922bAe249DDD79E4'.toLowerCase(),
  VaultETHFEI_fuse: '0xf3caa27dd9926B391f50849BDFdB8A06Fb489b67'.toLowerCase(),
};

const VAULTS = {
  [VAULTS_ADDRESS.VaultETHDAI_core]: {
    borrowAsset: ASSETS[ASSET_NAME.DAI],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHDAI',
    market: 'core',
    chainId: 1,
    deployBlockNumber: 12386446,
  },
  [VAULTS_ADDRESS.VaultETHUSDC_core]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHUSDC',
    market: 'core',
    chainId: 1,
    deployBlockNumber: 12418746,
  },
  [VAULTS_ADDRESS.VaultETHUSDT_core]: {
    borrowAsset: ASSETS[ASSET_NAME.USDT],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHUSDT',
    market: 'core',
    chainId: 1,
    deployBlockNumber: 12694137,
  },
  [VAULTS_ADDRESS.VaultETHFEI_fuse]: {
    borrowAsset: ASSETS[ASSET_NAME.FEI],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHFEI',
    market: 'fuse',
    chainId: 1,
    deployBlockNumber: 13107920,
  },
  [VAULTS_ADDRESS.VaultETHUSDC_fuse]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHUSDC',
    market: 'fuse',
    chainId: 1,
    deployBlockNumber: 13107987,
  },
};

module.exports = { VAULTS_ADDRESS, VAULTS };
