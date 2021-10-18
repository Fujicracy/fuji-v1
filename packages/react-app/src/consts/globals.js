import { generateMedia } from 'styled-media-query';

export const BREAKPOINT_NAMES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  LARGE: 'large',
  XLARGE: 'xlarge',
};

export const BREAKPOINTS = {
  [BREAKPOINT_NAMES.MOBILE]: { inString: '450px', inNumber: 450 },
  [BREAKPOINT_NAMES.TABLET]: { inString: '768px', inNumber: 1120 },
  [BREAKPOINT_NAMES.DESKTOP]: { inString: '1280px', inNumber: 1170 },
  [BREAKPOINT_NAMES.LARGE]: { inString: '1920px', inNumber: 1440 },
};

export const fujiMedia = generateMedia({
  small: '450px',
  medium: '1120px',
  large: '1170px',
});

const NETWORK_ID = {
  FANTOM: 250,
  MAINNET: 1,
  KOVAN: 42,
  LOCAL: 31337,
};

const NETWORKS = {
  [NETWORK_ID.MAINNET]: 'Mainnet',
  [NETWORK_ID.KOVAN]: 'Kovan',
  [NETWORK_ID.FANTOM]: 'Fantom',
  [NETWORK_ID.LOCAL]: 'Local',
};

const DEPLOYMENT_TYPES = {
  CORE: 'core',
  FUSE: 'fuse',
};

const ETH_CAP_VALUE = process.env.REACT_APP_ETH_CAP_VALUE || 2;

const CHAIN_NAMES = {
  ETHEREUM: 'ethereum',
  FANTOM: 'fantom',
};

const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME || CHAIN_NAMES.ETHEREUM;

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID || 31337;
const NETWORK = NETWORKS[CHAIN_ID];
const APP_URL = process.env.REACT_APP_APP_URL || 'http://localhost:3000';
const LANDING_URL = process.env.REACT_APP_LANDING_URL || 'http://localhost:3000';
const INFURA_ID = process.env.REACT_APP_INFURA_ID;
const DEPLOYMENT = process.env.REACT_APP_DEPLOYMENT || DEPLOYMENT_TYPES.CORE;

const MERKLE_DIST_ADDR = '0x51407A073fb7C703185f47c3FBB1B915678221b8';
const FUJIFLOPS_NFT_ADDR = '0x376C0AA9150095cB36AdcD472bE390D31C6BeF8F';

export {
  CHAIN_ID,
  CHAIN_NAME,
  CHAIN_NAMES,
  NETWORK,
  APP_URL,
  LANDING_URL,
  INFURA_ID,
  DEPLOYMENT,
  DEPLOYMENT_TYPES,
  ETH_CAP_VALUE,
  MERKLE_DIST_ADDR,
  FUJIFLOPS_NFT_ADDR,
};
