import { ethers } from 'ethers';
import { INFURA_ID, PROVIDER_URL } from '../consts/index.js';

export const getProvider = () => {
  if (INFURA_ID) {
    return new ethers.providers.InfuraProvider('homestead', INFURA_ID);
  } else if (PROVIDER_URL) {
    return new ethers.providers.JsonRpcProvider(PROVIDER_URL);
  } else {
    throw new Error('INFURA_ID or PROVIDER_URL not set: please, set at least one in ".env"!');
  }
}
