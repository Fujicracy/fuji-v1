const PROVIDER_TYPE = {
  AAVE: 'AAVE',
  COMPOUND: 'Compound',
  IRONBANK: 'IronBank',
  FUSE3: 'FusePool3',
  FUSE6: 'FusePool6',
  FUSE7: 'FusePool7',
  FUSE8: 'FusePool8',
  FUSE18: 'FusePool18',
  CREAM: 'Cream',
  GEIST: 'Geist',
  HUNDRED: 'Hundred',
  COMPOUND_MOCK: 'CompoundMock',
  AAVE_V3_FTM: 'AaveV3FTM',
  AAVE_MATIC: 'AaveV2MATIC',
  AAVE_V3_MATIC: 'AaveV3MATIC',
  AAVE_V3_ARB: 'AaveV3ARB',
  DFORCE_ARB: 'DForceARB',
  WEPIGGY_ARB: 'WePiggyARB'
};

const PROVIDERS = {
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
  [PROVIDER_TYPE.IRONBANK]: {
    id: 'ironbank',
    name: 'ProviderIronBank',
    title: 'IronBank',
  },
  [PROVIDER_TYPE.FUSE3]: {
    id: 'fuse3',
    name: 'ProviderFuse3',
    title: 'RariDAO Pool',
  },
  [PROVIDER_TYPE.FUSE6]: {
    id: 'fuse6',
    name: 'ProviderFuse6',
    title: "Tetranode's",
  },
  [PROVIDER_TYPE.FUSE7]: {
    id: 'fuse7',
    name: 'ProviderFuse7',
    title: 'Pool 7',
  },
  [PROVIDER_TYPE.FUSE8]: {
    id: 'fuse8',
    name: 'ProviderFuse8',
    title: 'Fei DAO Pool',
  },
  [PROVIDER_TYPE.FUSE18]: {
    id: 'fuse18',
    name: 'ProviderFuse18',
    title: 'Olympus Pool',
  },
  [PROVIDER_TYPE.CREAM]: {
    id: 'cream',
    name: 'ProviderCream',
    title: 'Iron Bank',
  },
  [PROVIDER_TYPE.GEIST]: {
    id: 'geist',
    name: 'ProviderGeist',
    title: 'Geist',
  },
  [PROVIDER_TYPE.HUNDRED]: {
    id: 'hundred',
    name: 'ProviderHundred',
    title: 'Hundred',
  },
  [PROVIDER_TYPE.COMPOUND_MOCK]: {
    id: 'compound-mock',
    name: 'ProviderMockCompound',
    title: 'MockCompound',
  },
  [PROVIDER_TYPE.AAVE_V3_FTM]: {
    id: 'aave-v3-ftm',
    name: 'ProviderAaveV3FTM',
    title: 'Aave V3',
  },
  [PROVIDER_TYPE.AAVE_MATIC]: {
    id: 'aave-matic',
    name: 'ProviderAaveMATIC',
    title: 'Aave',
  },
  [PROVIDER_TYPE.AAVE_V3_MATIC]: {
    id: 'aave-v3-matic',
    name: 'ProviderAaveV3MATIC',
    title: 'Aave V3',
  },
  [PROVIDER_TYPE.AAVE_V3_ARB]: {
    id: 'aave-v3-arbitrum',
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
