const PROVIDER_TYPE = {
  CREAM: 'Cream',
  GEIST: 'Geist',
  HUNDRED: 'Hundred',
  AAVE_V3: 'AaveV3',
};

const PROVIDERS = {
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
  [PROVIDER_TYPE.AAVE_V3]: {
    id: 'aave-v3',
    name: 'ProviderAaveV3FTM',
    title: 'Aave V3',
  },
};

export { PROVIDER_TYPE, PROVIDERS };
