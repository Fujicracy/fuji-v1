const PROVIDER_TYPE = {
  CREAM: 'Cream',
  GEIST: 'Geist',
  HUNDRED: 'Hundred',
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
};

export { PROVIDER_TYPE, PROVIDERS };
