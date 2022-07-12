const providerIndexes = {
  AAVE: '0', // on fantom it's Geist
  DYDX: '1',
  CREAM: '2',
  BALANCER: '3',
};

export const getFlashloanProvider = async setup => {
  const { config } = setup;

  let index = providerIndexes.AAVE;
  if (config.networkName === 'ethereum') {
    index = providerIndexes.BALANCER;
  } else if (config.networkName === 'fantom') {
    index = providerIndexes.AAVE;
  }

  return index;
};
