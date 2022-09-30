export const ASSET_NAME = {
  DAI: 'DAI',
  USDC: 'USDC',
  ETH: 'ETH',
};

export const ASSETS = {
  [ASSET_NAME.DAI]: {
    id: ASSET_NAME.DAI.toLowerCase(),
    name: ASSET_NAME.DAI,
    decimals: 18,
    address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    oracle: '0xc5C8E77B397E531B8EC06BFb0048328B30E9eCfB',
  },
  [ASSET_NAME.USDC]: {
    id: ASSET_NAME.USDC.toLowerCase(),
    name: ASSET_NAME.USDC,
    decimals: 6,
    address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    oracle: '0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3',
  },
  [ASSET_NAME.ETH]: {
    id: ASSET_NAME.ETH.toLowerCase(),
    name: ASSET_NAME.ETH,
    decimals: 18,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    oracle: '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612',
  },
};
