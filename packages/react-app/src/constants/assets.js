import {
  btcIcon,
  btcImage,
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
export const PROVIDER_TYPE = {
  AAVE: 'AAVE',
  COMPOUND: 'Compound',
  DYDX: 'DYDX',
  IRONBANK: 'IronBank',
};
export const PROVIDERS = {
  [PROVIDER_TYPE.AAVE]: {
    id: 'aave',
    name: 'ProviderAave',
    title: 'Aave',
  },
  [PROVIDER_TYPE.COMPOUND]: {
    id: 'compound',
    name: 'ProviderCompound',
    title: 'Compound',
  },
  [PROVIDER_TYPE.DYDX]: {
    id: 'dydx',
    name: 'ProviderDYDX',
    title: 'dYdX',
  },
  [PROVIDER_TYPE.IRONBANK]: {
    id: 'ironbank',
    name: 'ProviderIronBank',
    title: 'IronBank',
  },
};
export const ASSETS = {
  [ASSET_NAME.DAI]: {
    id: ASSET_NAME.DAI.toLowerCase(),
    name: ASSET_NAME.DAI,
    icon: daiIcon.toString(),
    image: daiImage,
    decimals: 18,
    type: ASSET_TYPE.BORROW,
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.DYDX],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
  [ASSET_NAME.USDC]: {
    id: ASSET_NAME.USDC.toLowerCase(),
    name: ASSET_NAME.USDC,
    icon: usdcIcon.toString(),
    image: usdcImage,
    decimals: 6,
    type: ASSET_TYPE.BORROW,
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.DYDX],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
  [ASSET_NAME.USDT]: {
    id: ASSET_NAME.USDT.toLowerCase(),
    name: ASSET_NAME.USDT,
    icon: usdtIcon.toString(),
    image: usdtImage,
    decimals: 6,
    type: ASSET_TYPE.BORROW,
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
  [ASSET_NAME.ETH]: {
    id: ASSET_NAME.ETH.toLowerCase(),
    name: ASSET_NAME.ETH,
    icon: ethIcon.toString(),
    image: ethImage,
    decimals: 18,
    type: ASSET_TYPE.COLLATERAL,
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
  [ASSET_NAME.BTC]: {
    id: ASSET_NAME.BTC.toLowerCase(),
    name: ASSET_NAME.BTC,
    icon: btcIcon.toString(),
    image: btcImage,
    decimals: 18,
    type: ASSET_TYPE.COLLATERAL,
    providers: [
      PROVIDERS[PROVIDER_TYPE.AAVE],
      PROVIDERS[PROVIDER_TYPE.COMPOUND],
      PROVIDERS[PROVIDER_TYPE.IRONBANK],
    ],
  },
};
