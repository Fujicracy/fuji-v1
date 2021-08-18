import { ethers, Wallet } from 'ethers';
import { DefenderRelayProvider, DefenderRelaySigner } from 'defender-relay-client/lib/ethers/index.js';
import {
  INFURA_ID,
  PROVIDER_URL,
  PRIVATE_KEY,
  RELAYER_API_KEY,
  RELAYER_API_SECRET,
} from '../consts/index.js';

const getProvider = () => {
  if (INFURA_ID) {
    return new ethers.providers.InfuraProvider('homestead', INFURA_ID);
  } else {
    console.log(`Connecting to ${PROVIDER_URL}`);
    return new ethers.providers.JsonRpcProvider(PROVIDER_URL);
  }}


export const getSigner = () => {
  if (RELAYER_API_KEY && RELAYER_API_SECRET) {
    // use Open Zeppelin relayer in production
    // to avoid storing private keys
    // https://docs.openzeppelin.com/defender/relay
    const credentials = { apiKey: RELAYER_API_KEY, apiSecret: RELAYER_API_SECRET };
    const provider = new DefenderRelayProvider(credentials);

    return new DefenderRelaySigner(credentials, provider, { speed: 'fast' });
  } else if (PRIVATE_KEY) {
    // run only locally for testing
    const provider = getProvider();

    return new Wallet(PRIVATE_KEY, provider);
  } else {
    const provider = getProvider();

    return { provider };
  }
}
