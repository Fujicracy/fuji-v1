const PROVIDER_TYPE = {
  AAVE: 'AAVE',
  COMPOUND: 'Compound',
  DYDX: 'DYDX',
  IRONBANK: 'IronBank',
  FUSE3: 'FusePool3',
  FUSE6: 'FusePool6',
  FUSE7: 'FusePool7',
  FUSE8: 'FusePool8',
  FUSE18: 'FusePool18',
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
  [PROVIDER_TYPE.DYDX]: {
    id: 'dydx',
    name: 'ProviderDYDX',
    title: 'DyDx',
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
};

export { PROVIDER_TYPE, PROVIDERS };
