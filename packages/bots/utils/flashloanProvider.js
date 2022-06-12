import { ASSETS } from '../consts/index.js';

const providerIndexes = {
  AAVE: '0', // on fantom it's Geist
  DYDX: '1',
  CREAM: '2',
  BALANCER: '3',
};

export const getFlashloanProvider = async (setup, vault) => {
  const { contracts, config } = setup;

  const { borrowAsset } = await vault.vAssets();
  const activeProvider = await vault.activeProvider();

  let index = providerIndexes.AAVE;
  if (config.networkName === 'ethereum') {
    index = providerIndexes.BALANCER;
  } else if (config.networkName === 'fantom') {
    index = providerIndexes.AAVE;
  }

  return index;
};
