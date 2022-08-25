import { usdcIcon, daiIcon, ethIcons, btcIcon } from 'assets/images';

export const ASSET_NAME = {
  ETH: 'ETH',
  DAI: 'DAI',
  USDC: 'USDC',
  BTC: 'BTC',
};

export const ASSETS = {
  [ASSET_NAME.ETH]: {
    id: ASSET_NAME.ETH.toLowerCase(),
    name: ASSET_NAME.ETH,
    icon: ethIcons.BLUE.toString(),
    decimals: 18,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    oracle: '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612',
  },
  [ASSET_NAME.DAI]: {
    id: ASSET_NAME.DAI.toLowerCase(),
    name: ASSET_NAME.DAI,
    icon: daiIcon.toString(),
    decimals: 18,
    address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    oracle: '0xc5C8E77B397E531B8EC06BFb0048328B30E9eCfB',
    isERC20: true,
  },
  [ASSET_NAME.USDC]: {
    id: ASSET_NAME.USDC.toLowerCase(),
    name: ASSET_NAME.USDC,
    icon: usdcIcon.toString(),
    decimals: 6,
    address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    oracle: '0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3',
    isERC20: true,
  },
  [ASSET_NAME.BTC]: {
    id: ASSET_NAME.BTC.toLowerCase(),
    name: ASSET_NAME.BTC,
    icon: btcIcon.toString(),
    decimals: 8,
    address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    oracle: '0x6ce185860a4963106506C203335A2910413708e9',
    isERC20: true,
  },
};
