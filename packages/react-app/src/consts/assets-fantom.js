import { daiIcon, usdcIcon, ftmIcon, btcIcon } from 'assets/images';

export const ASSET_NAME = {
  DAI: 'DAI',
  USDC: 'USDC',
  FTM: 'FTM',
  BTC: 'BTC',
};

export const ASSETS = {
  [ASSET_NAME.DAI]: {
    id: ASSET_NAME.DAI.toLowerCase(),
    name: ASSET_NAME.DAI,
    icon: daiIcon.toString(),
    decimals: 18,
    address: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
    oracle: '0x91d5DEFAFfE2854C7D02F50c80FA1fdc8A721e52',
    isERC20: true,
  },
  [ASSET_NAME.USDC]: {
    id: ASSET_NAME.USDC.toLowerCase(),
    name: ASSET_NAME.USDC,
    icon: usdcIcon.toString(),
    decimals: 6,
    address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
    oracle: '0x2553f4eeb82d5A26427b8d1106C51499CBa5D99c',
    isERC20: true,
  },
  [ASSET_NAME.FTM]: {
    id: ASSET_NAME.FTM.toLowerCase(),
    name: ASSET_NAME.FTM,
    icon: ftmIcon.toString(),
    decimals: 18,
    address: '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF',
    oracle: '0xf4766552D15AE4d256Ad41B6cf2933482B0680dc',
  },
  [ASSET_NAME.BTC]: {
    id: ASSET_NAME.BTC.toLowerCase(),
    name: ASSET_NAME.BTC,
    icon: btcIcon.toString(),
    decimals: 8,
    address: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
    oracle: '0x8e94C22142F4A64b99022ccDd994f4e9EC86E4B4',
    isERC20: true,
  },
};
