import {
  // btcIcon,
  // btcImage,
  daiIcon,
  usdcIcon,
  usdtIcon,
  ethIcon,
  daiImage,
  usdcImage,
  usdtImage,
  ethImage,
} from 'assets/images';

export const ASSET_NAME = {
  DAI: 'DAI',
  USDC: 'USDC',
  USDT: 'USDT',
  ETH: 'ETH',
  BTC: 'BTC',
};

export const ASSET_TYPE = {
  BORROW: 0, // borrow asset
  COLLATERAL: 1, // collateral asset
  BOTH: 2, // both
};
export const ASSETS = {
  [ASSET_NAME.DAI]: {
    id: ASSET_NAME.DAI.toLowerCase(),
    name: ASSET_NAME.DAI,
    icon: daiIcon.toString(),
    image: daiImage,
    decimals: 18,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  [ASSET_NAME.USDC]: {
    id: ASSET_NAME.USDC.toLowerCase(),
    name: ASSET_NAME.USDC,
    icon: usdcIcon.toString(),
    image: usdcImage,
    decimals: 6,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  [ASSET_NAME.USDT]: {
    id: ASSET_NAME.USDT.toLowerCase(),
    name: ASSET_NAME.USDT,
    icon: usdtIcon.toString(),
    image: usdtImage,
    decimals: 6,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  [ASSET_NAME.ETH]: {
    id: ASSET_NAME.ETH.toLowerCase(),
    name: ASSET_NAME.ETH,
    icon: ethIcon.toString(),
    image: ethImage,
    decimals: 18,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  },
  // [ASSET_NAME.BTC]: {
  //   id: ASSET_TYPE.BTC.toLowerCase(),
  //   name: ASSET_TYPE.BTC,
  //   icon: btcIcon.toString(),
  //   image: btcImage,
  //   decimals: 18,
  //   address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  // },
};
