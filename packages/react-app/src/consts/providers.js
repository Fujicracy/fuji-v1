import { getContractAddress } from 'helpers';

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
    address: getContractAddress('ProviderAave'),
  },
  [PROVIDER_TYPE.COMPOUND]: {
    id: 'compound',
    name: 'ProviderCompound',
    title: 'Compound',
    address: getContractAddress('ProviderCompound'),
  },
  [PROVIDER_TYPE.DYDX]: {
    id: 'dydx',
    name: 'ProviderDYDX',
    title: 'DyDx',
    address: getContractAddress('ProviderDYDX'),
  },
  [PROVIDER_TYPE.IRONBANK]: {
    id: 'ironbank',
    name: 'ProviderIronBank',
    title: 'IronBank',
    address: getContractAddress('ProviderIronBank'),
  },
  [PROVIDER_TYPE.FUSE3]: {
    id: 'fuse3',
    name: 'ProviderFuse3',
    title: 'Fuse Pool 3',
    address: getContractAddress('ProviderFuse3'),
  },
  [PROVIDER_TYPE.FUSE6]: {
    id: 'fuse6',
    name: 'ProviderFuse6',
    title: 'Fuse Pool 6',
    address: getContractAddress('ProviderFuse6'),
  },
  [PROVIDER_TYPE.FUSE7]: {
    id: 'fuse7',
    name: 'ProviderFuse7',
    title: 'Fuse Pool 7',
    address: getContractAddress('ProviderFuse7'),
  },
  [PROVIDER_TYPE.FUSE8]: {
    id: 'fuse8',
    name: 'ProviderFuse8',
    title: 'Fuse Pool 8',
    address: getContractAddress('ProviderFuse8'),
  },
  [PROVIDER_TYPE.FUSE18]: {
    id: 'fuse18',
    name: 'ProviderFuse18',
    title: 'Fuse Pool 18',
    address: getContractAddress('ProviderFuse18'),
  },
};

export { PROVIDER_TYPE, PROVIDERS };
