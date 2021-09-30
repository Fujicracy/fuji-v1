import { daiIcon, usdcIcon, usdtIcon, feiIcon, ethIcons } from 'assets/images';

export const ASSET_NAME = {
  DAI: 'DAI',
  USDC: 'USDC',
  USDT: 'USDT',
  ETH: 'ETH',
  BTC: 'BTC',
  FEI: 'FEI',
};

export const ASSETS = {
  [ASSET_NAME.DAI]: {
    id: ASSET_NAME.DAI.toLowerCase(),
    name: ASSET_NAME.DAI,
    icon: daiIcon.toString(),
    decimals: 18,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    oracle: '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
  },
  [ASSET_NAME.USDC]: {
    id: ASSET_NAME.USDC.toLowerCase(),
    name: ASSET_NAME.USDC,
    icon: usdcIcon.toString(),
    decimals: 6,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    oracle: '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
  },
  [ASSET_NAME.USDT]: {
    id: ASSET_NAME.USDT.toLowerCase(),
    name: ASSET_NAME.USDT,
    icon: usdtIcon.toString(),
    decimals: 6,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    oracle: '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
  },
  [ASSET_NAME.ETH]: {
    id: ASSET_NAME.ETH.toLowerCase(),
    name: ASSET_NAME.ETH,
    icon: ethIcons.BLUE.toString(),
    decimals: 18,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    oracle: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  },
  [ASSET_NAME.FEI]: {
    id: ASSET_NAME.FEI.toLowerCase(),
    name: ASSET_NAME.FEI,
    icon: feiIcon.toString(),
    decimals: 18,
    address: '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
    oracle: '0x31e0a88fecB6eC0a411DBe0e9E76391498296EE9',
  },
};
