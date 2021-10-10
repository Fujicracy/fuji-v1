/* eslint-disable import/no-dynamic-require */
import { CHAIN_ID, DEPLOYMENT } from 'consts/globals';

const contractsData = require(`../contracts/${CHAIN_ID}-${DEPLOYMENT}.deployment.json`);

export function getContractAddress(name) {
  let address = '0x';
  try {
    address = contractsData[name].address.toLowerCase();
  } catch (e) {
    console.warn(`WARNING: ${name} not found!`);
  }

  return address;
}
