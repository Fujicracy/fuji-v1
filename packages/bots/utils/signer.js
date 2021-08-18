import { Wallet } from 'ethers';
import { PRIVATE_KEY } from '../consts/index.js';

export const getSigner = (provider) => {
  if (PRIVATE_KEY) {
    return new Wallet(PRIVATE_KEY, provider);
  } else {
    throw new Error('PRIVATE_KEY not set: please, set it in ".env"!');
  }
}
