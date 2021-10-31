/* eslint-disable import/no-dynamic-require */

const contractsData = require(`../contracts/250-core.deployment.json`);

export function getContractAddress(name) {
  let address = '0x';
  try {
    address = contractsData[name].address.toLowerCase();
  } catch (e) {
    console.warn(`WARNING: ${name} not found!`);
  }

  return address;
}
