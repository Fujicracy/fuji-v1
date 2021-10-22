import { ethers, Wallet } from 'ethers';
import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from 'defender-relay-client/lib/ethers/index.js';

const getProvider = (config) => {
  if (config.infuraId) {
    const url = `https://${config.networkName}.infura.io/v3/${config.infuraId}`;
    return new ethers.providers.JsonRpcProvider(url);
  }
  console.log(`Connecting to ${config.providerUrl}`);
  return new ethers.providers.JsonRpcProvider(config.providerUrl);
};

export const getSigner = (config) => {
  if (config.relayerApiKey && config.relayerApiSecret) {
    // use Open Zeppelin relayer in production
    // to avoid storing private keys
    // https://docs.openzeppelin.com/defender/relay
    const credentials = {
      apiKey: config.relayerApiKey,
      apiSecret: config.relayerApiSecret
    };
    const provider = new DefenderRelayProvider(credentials);

    return new DefenderRelaySigner(credentials, provider, { speed: 'fast' });
  }
  if (config.privateKey) {
    // run only locally for testing
    const provider = getProvider(config);

    return new Wallet(config.privateKey, provider);
  }
  const provider = getProvider(config);

  return { provider };
};
