export const BREAKPOINT_NAMES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  LARGE: 'large',
  XLARGE: 'xlarge',
};

export const BREAKPOINTS = {
  [BREAKPOINT_NAMES.MOBILE]: '600px',
  [BREAKPOINT_NAMES.TABLET]: '768px',
  [BREAKPOINT_NAMES.DESKTOP]: '992px',
  [BREAKPOINT_NAMES.LARGE]: '1200px',
  [BREAKPOINT_NAMES.XLARGE]: '1400px',
};

const NETWORKS = {
  1: 'Mainnet',
  42: 'Kovan',
  31337: 'Local',
};

const ETH_CAP_VALUE = 2;

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID || 31337;
const NETWORK = NETWORKS[CHAIN_ID];
const APP_URL = process.env.REACT_APP_APP_URL || 'http://localhost:3000';
const LANDING_URL = process.env.REACT_APP_LANDING_URL || 'http://localhost:3000';
const INFURA_ID = process.env.REACT_APP_INFURA_ID;

export { CHAIN_ID, NETWORK, APP_URL, LANDING_URL, INFURA_ID, ETH_CAP_VALUE };
