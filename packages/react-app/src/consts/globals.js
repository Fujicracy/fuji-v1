export const BREAKPOINT_NAMES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  LARGE: 'large',
  XLARGE: 'xlarge',
};

export const BREAKPOINTS = {
  [BREAKPOINT_NAMES.MOBILE]: { inString: '600px', inNumber: 600 },
  [BREAKPOINT_NAMES.TABLET]: { inString: '768px', inNumber: 768 },
  [BREAKPOINT_NAMES.DESKTOP]: { inString: '992px', inNumber: 992 },
  [BREAKPOINT_NAMES.LARGE]: { inString: '1200px', inNumber: 1200 },
  [BREAKPOINT_NAMES.XLARGE]: { inString: '1400px', inNumber: 1400 },
};

const NETWORKS = {
  1: 'Mainnet',
  42: 'Kovan',
  31337: 'Local',
};

const DEPLOYMENT_TYPES = {
  CORE: 'core',
  FUSE: 'fuse',
};

const ETH_CAP_VALUE = process.env.REACT_APP_ETH_CAP_VALUE || 2;

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID || 31337;
const NETWORK = NETWORKS[CHAIN_ID];
const APP_URL = process.env.REACT_APP_APP_URL || 'http://localhost:3000';
const LANDING_URL = process.env.REACT_APP_LANDING_URL || 'http://localhost:3000';
const INFURA_ID = process.env.REACT_APP_INFURA_ID;
const DEPLOYMENT = process.env.REACT_APP_DEPLOYMENT || DEPLOYMENT_TYPES.CORE;
const FUSE_DASHBOARD_URL =
  process.env.REACT_APP_FUSE_DASHBOARD_URL || 'https://fuse.fujidao.org/#/dashboard';
export {
  CHAIN_ID,
  NETWORK,
  APP_URL,
  LANDING_URL,
  INFURA_ID,
  DEPLOYMENT,
  DEPLOYMENT_TYPES,
  ETH_CAP_VALUE,
  FUSE_DASHBOARD_URL,
};
