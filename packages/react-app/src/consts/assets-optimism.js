import { usdcIcon, ethIcons } from 'assets/images';

export const ASSET_NAME = {
  ETH: 'ETH',
  USDC: 'USDC',
};

export const ASSETS = {
  [ASSET_NAME.ETH]: {
    id: ASSET_NAME.ETH.toLowerCase(),
    name: ASSET_NAME.ETH,
    icon: ethIcons.BLUE.toString(),
    decimals: 18,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    oracle: '0x13e3Ee699D1909E989722E753853AE30b17e08c5',
  },
  [ASSET_NAME.USDC]: {
    id: ASSET_NAME.USDC.toLowerCase(),
    name: ASSET_NAME.USDC,
    icon: usdcIcon.toString(),
    decimals: 6,
    address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    oracle: '0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3',
    isERC20: true,
  },
};
