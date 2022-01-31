const PROVIDER_TYPE = {
  AAVE: 'AAVE',
  COMPOUND: 'Compound',
  IRONBANK: 'IronBank',
  FUSE3: 'FusePool3',
  FUSE6: 'FusePool6',
  FUSE7: 'FusePool7',
  FUSE8: 'FusePool8',
  FUSE18: 'FusePool18',
  SCREAM: 'Scream',
  CREAM: 'Cream',
  GEIST: 'Geist',
  HUNDRED: 'Hundred',
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

  [PROVIDER_TYPE.SCREAM]: {
    id: 'scream',
    name: 'ProviderScream',
    title: 'Scream',
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
    title: 'Hundred Finance',
  },
};

export { PROVIDER_TYPE, PROVIDERS };
