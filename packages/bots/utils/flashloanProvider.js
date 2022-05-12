import { ASSETS } from '../consts/index.js';

const providerIndexes = {
  AAVE: '0', // on fantom it's Geist
  DYDX: '1',
  CREAM: '2',
};

const getForEthereum = (contracts, activeProvider, borrowAsset) => {
  const assets = ASSETS.ethereum;

  if ([assets.DAI.address, assets.USDC.address].includes(borrowAsset)) {
    // use dydx flashloans when underlying asset is DAI or USDC
    return providerIndexes.DYDX;
  }
  return providerIndexes.AAVE;
};

export const getFlashloanProvider = async (setup, vault) => {
  const { contracts, config } = setup;

  const { borrowAsset } = await vault.vAssets();
  const activeProvider = await vault.activeProvider();

  let index = providerIndexes.AAVE;
  if (config.networkName === 'ethereum') {
    index = getForEthereum(contracts, activeProvider, borrowAsset);
  } else if (config.networkName === 'fantom') {
    index = providerIndexes.AAVE;
  }

  return index;
};
