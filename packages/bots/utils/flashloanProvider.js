import { ASSETS, PROVIDERS, PROVIDER_TYPE } from '../consts/index.js';

export const getFlashloanProvider = async (vault, contracts) => {
  const providerIndex = {
    aave: 0,
    dydx: 1,
    cream: 2,
  };
  const { borrowAsset } = await vault.vAssets();
  const activeProvider = await vault.activeProvider();
  const dydxProviderAddr = PROVIDERS[PROVIDER_TYPE.DYDX].address;

  if (
    [ASSETS.DAI.address, ASSETS.USDC.address].includes(borrowAsset) &&
    activeProvider !== dydxProviderAddr
  ) {
    // use dydx flashloans when underlying asset is DAI or USDC and
    // current activeProvider is not dYdX
    return providerIndex.dydx;
  }
  return providerIndex.cream;
};
