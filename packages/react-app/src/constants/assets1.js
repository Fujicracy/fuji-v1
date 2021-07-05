import {
  daiIcon,
  usdcIcon,
  usdtIcon,
  ethIcon,
  daiImage,
  usdcImage,
  usdtImage,
  ethImage,
  btcIcon,
  btcImage,
} from 'assets/images';

export const ASSET_TYPE = {
  DAI: 'DAI',
  USDC: 'USDC',
  USDT: 'USDT',
  ETH: 'ETH',
  BTC: 'BTC',
};
export const ASSETS = {
  [ASSET_TYPE.DAI]: {
    id: ASSET_TYPE.DAI.toLowerCase(),
    name: ASSET_TYPE.DAI,
    icon: daiIcon.toString(),
    image: daiImage,
    decimals: 18,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  [ASSET_TYPE.USDC]: {
    id: ASSET_TYPE.USDC.toLowerCase(),
    name: ASSET_TYPE.USDC,
    icon: usdcIcon.toString(),
    image: usdcImage,
    decimals: 6,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  [ASSET_TYPE.USDT]: {
    id: ASSET_TYPE.USDT.toLowerCase(),
    name: ASSET_TYPE.USDT,
    icon: usdtIcon.toString(),
    image: usdtImage,
    decimals: 6,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  [ASSET_TYPE.ETH]: {
    id: ASSET_TYPE.ETH.toLowerCase(),
    name: ASSET_TYPE.ETH,
    icon: ethIcon.toString(),
    image: ethImage,
    decimals: 18,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  },
  [ASSET_TYPE.BTC]: {
    id: ASSET_TYPE.BTC.toLowerCase(),
    name: ASSET_TYPE.BTC,
    icon: btcIcon.toString(),
    image: btcImage,
    decimals: 18,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  },
};
