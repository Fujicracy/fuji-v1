import fs from 'fs';
import { CHAIN_ID, DEPLOYMENT } from '../consts/globals.js';

const contractsData = JSON.parse(
  fs.readFileSync(`./contracts/${CHAIN_ID}-${DEPLOYMENT}.deployment.json`),
);

export function getContractAddress(name) {
  let address = '0x';
  try {
    address = contractsData[name].address.toLowerCase();
  } catch (e) {
    console.warn(`WARNING: ${name} not found!`);
  }

  return address;
}
