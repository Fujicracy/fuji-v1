import { daiIcon, usdcIcon, usdtIcon, daiImage, usdcImage, usdtImage } from 'assets/images';

export const ASSET_TYPE = {
  DAI: 'DAI',
  USDC: 'USDC',
  USDT: 'USDT',
};

export const ASSETS = {
  [ASSET_TYPE.DAI]: {
    id: ASSET_TYPE.DAI.toLowerCase(),
    name: ASSET_TYPE.DAI,
    icon: daiIcon.toString(),
    image: daiImage,
    decimals: 18,
    vault: 'VaultETHDAI',
    providers: ['ProviderAave', 'ProviderCompound', 'ProviderDYDX', 'ProviderIronBank'],
  },
  [ASSET_TYPE.USDC]: {
    id: ASSET_TYPE.USDC.toLowerCase(),
    name: ASSET_TYPE.USDC,
    icon: usdcIcon.toString(),
    image: usdcImage,
    decimals: 6,
    vault: 'VaultETHUSDC',
    providers: ['ProviderAave', 'ProviderCompound', 'ProviderDYDX', 'ProviderIronBank'],
  },
  [ASSET_TYPE.USDT]: {
    id: ASSET_TYPE.USDT.toLowerCase(),
    name: ASSET_TYPE.USDT,
    icon: usdtIcon.toString(),
    image: usdtImage,
    decimals: 6,
    vault: 'VaultETHUSDT',
    providers: ['ProviderAave', 'ProviderCompound', 'ProviderIronBank'],
  },
};
