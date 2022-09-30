const PROVIDER_TYPE = {
  AAVE_V3_ARB: 'AaveV3ARB',
  DFORCE_ARB: 'DForceARB',
  WEPIGGY_ARB: 'WePiggyARB',
};

const PROVIDERS = {
  [PROVIDER_TYPE.AAVE_V3_ARB]: {
    id: 'Aave-v3-arbitrum',
    name: 'ProviderAaveV3Arbitrum',
    title: 'Aave V3',
  },
  [PROVIDER_TYPE.DFORCE_ARB]: {
    id: 'DForce-arbitrum',
    name: 'ProviderDForceArbitrum',
    title: 'DForce',
  },
  [PROVIDER_TYPE.WEPIGGY_ARB]: {
    id: 'WePiggy-arbitrum',
    name: 'ProviderWePiggyArbitrum',
    title: 'WePiggy',
  },
};

export { PROVIDER_TYPE, PROVIDERS };
