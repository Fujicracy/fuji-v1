import { daiIcon, usdcIcon, usdtIcon, daiImage, usdcImage, usdtImage } from 'assets/images';

export const ASSET_TYPE = {
  DAI: 'DAI',
  USDC: 'USDC',
  USDT: 'USDT',
};

export const ASSETS = [
  {
    id: ASSET_TYPE.DAI.toLowerCase(),
    name: ASSET_TYPE.DAI,
    icon: daiIcon.toString(),
    image: daiImage,
  },
  {
    id: ASSET_TYPE.USDC.toLowerCase(),
    name: ASSET_TYPE.USDC,
    icon: usdcIcon.toString(),
    image: usdcImage,
  },
  {
    id: ASSET_TYPE.USDT.toLowerCase(),
    name: ASSET_TYPE.USDT,
    icon: usdtIcon.toString(),
    image: usdtImage,
  },
];
