import { getContractAddress } from '../utils/index.js';
import { ASSETS, ASSET_NAME } from './assets.js';

const VAULTS_ADDRESS = {
  VaultETHDAI: getContractAddress('VaultETHDAI'),
  VaultETHUSDC: getContractAddress('VaultETHUSDC'),
  VaultETHUSDT: getContractAddress('VaultETHUSDT'),
};

const VAULTS = {
  [VAULTS_ADDRESS.VaultETHDAI]: {
    borrowAsset: ASSETS[ASSET_NAME.DAI],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHDAI',
    title: 'ETH-DAI',
    deployBlockNumber: 12386446,
  },
  [VAULTS_ADDRESS.VaultETHUSDC]: {
    borrowAsset: ASSETS[ASSET_NAME.USDC],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    name: 'VaultETHUSDC',
    title: 'ETH-USDC',
    deployBlockNumber: 12418746,
  },
  [VAULTS_ADDRESS.VaultETHUSDT]: {
    borrowAsset: ASSETS[ASSET_NAME.USDT],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
    title: 'ETH-USDT',
    deployBlockNumber: 12694137,
  },
};

export { VAULTS_ADDRESS, VAULTS };
