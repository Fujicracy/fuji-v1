import fs from 'fs';
import { Contract } from 'ethers';

const loadContractFrom = (contracts, contractName, signer) => {
  const address = contracts[contractName].address;
  const abi = contracts[contractName].abi;
  const bytecode = contracts[contractName].bytecode;

  const contract = new Contract(address, abi, signer);
  if (bytecode) contract.bytecode = bytecode;

  return contract;
};

export const loadContracts = async (providerOrSigner, chainId, deployment) => {
  let newContracts;

  try {
    // we need to check to see if this providerOrSigner has a signer or not
    let signer;
    let accounts;
    if (providerOrSigner && typeof providerOrSigner.listAccounts === 'function') {
      accounts = await providerOrSigner.listAccounts();
    }

    if (accounts && accounts.length > 0) {
      signer = providerOrSigner.getSigner();
    } else {
      signer = providerOrSigner;
    }

    const contractsData = JSON.parse(
      fs.readFileSync(`./contracts/${chainId}-${deployment}.deployment.json`),
    );
    const contractList = Object.keys(contractsData);

    newContracts = contractList.reduce((accumulator, contractName) => {
      accumulator[contractName] = loadContractFrom(contractsData, contractName, signer);
      return accumulator;
    }, {});
  } catch (e) {
    console.log('ERROR LOADING CONTRACTS!!', e);
  }

  return newContracts;
};
