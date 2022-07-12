const PROVIDER_TYPE = {
  FUSE3: 'FusePool3',
  FUSE6: 'FusePool6',
  FUSE7: 'FusePool7',
  FUSE8: 'FusePool8',
  FUSE18: 'FusePool18',
};

const PROVIDERS = {
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
