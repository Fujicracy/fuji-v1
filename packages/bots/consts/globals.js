import {} from 'dotenv/config';

const DEPLOYMENT_TYPES = {
  CORE: 'core',
  FUSE: 'fuse',
};

const CHAIN_ID = process.env.CHAIN_ID || 31337;
const DEPLOYMENT = process.env.DEPLOYMENT || DEPLOYMENT_TYPES.CORE;

const INFURA_ID = process.env.INFURA_ID;
const PROVIDER_URL = process.env.PROVIDER_URL || 'http://localhost:8545';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
// use Open Zeppelin relayer in production
// to avoid storing private keys
// https://docs.openzeppelin.com/defender/relay
const RELAYER_API_KEY = process.env.RELAYER_API_KEY;
const RELAYER_API_SECRET = process.env.RELAYER_API_SECRET;

export {
  CHAIN_ID,
  INFURA_ID,
  PROVIDER_URL,
  PRIVATE_KEY,
  RELAYER_API_KEY,
  RELAYER_API_SECRET,
  DEPLOYMENT,
  DEPLOYMENT_TYPES,
};

