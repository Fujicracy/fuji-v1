import { usdcIcon, daiIcon, ethIcons } from 'assets/images';

export const ASSET_NAME = {
  USDC: 'USDC',
  ETH: 'ETH',
  DAI: 'DAI',
};

export const ASSETS = {
  [ASSET_NAME.USDC]: {
    id: ASSET_NAME.USDC.toLowerCase(),
    name: ASSET_NAME.USDC,
    icon: usdcIcon.toString(),
    decimals: 6,
    address: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
    oracle: '0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB',
    isERC20: true,
  },
  [ASSET_NAME.DAI]: {
    id: ASSET_NAME.DAI.toLowerCase(),
    name: ASSET_NAME.DAI,
    icon: daiIcon.toString(),
    decimals: 18,
    address: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
    oracle: '0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF',
    isERC20: true,
  },
  [ASSET_NAME.ETH]: {
    id: ASSET_NAME.ETH.toLowerCase(),
    name: ASSET_NAME.ETH,
    icon: ethIcons.BLUE.toString(),
    decimals: 18,
    address: '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF',
    oracle: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
  },
};
