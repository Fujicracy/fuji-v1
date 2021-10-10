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
    decimals: 18,
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    oracle: '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
  },
  [ASSET_NAME.USDC]: {
    id: ASSET_NAME.USDC.toLowerCase(),
    name: ASSET_NAME.USDC,
    decimals: 6,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    oracle: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
  },
  [ASSET_NAME.USDT]: {
    id: ASSET_NAME.USDT.toLowerCase(),
    name: ASSET_NAME.USDT,
    decimals: 6,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    oracle: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
  },
  [ASSET_NAME.ETH]: {
    id: ASSET_NAME.ETH.toLowerCase(),
    name: ASSET_NAME.ETH,
    decimals: 18,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    oracle: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  },
  [ASSET_NAME.FEI]: {
    id: ASSET_NAME.FEI.toLowerCase(),
    name: ASSET_NAME.FEI,
    decimals: 18,
    address: '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
    oracle: '0x31e0a88fecB6eC0a411DBe0e9E76391498296EE9',
  },
};
