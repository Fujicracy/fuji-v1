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
