import {} from 'dotenv/config';

const DEPLOYMENT_TYPES = {
  CORE: 'core',
  FUSE: 'fuse',
};

const CHAIN_ID = process.env.CHAIN_ID || 31337;
const INFURA_ID = process.env.INFURA_ID;
const PROVIDER_URL = process.env.PROVIDER_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const DEPLOYMENT = process.env.DEPLOYMENT || DEPLOYMENT_TYPES.CORE;

export {
  CHAIN_ID,
  INFURA_ID,
  PROVIDER_URL,
  PRIVATE_KEY,
  DEPLOYMENT,
  DEPLOYMENT_TYPES,
};

