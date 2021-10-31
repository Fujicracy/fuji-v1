/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Contract } from '@ethersproject/contracts';
import { useState, useEffect } from 'react';
import { ASSETS } from 'consts/assets';
import { ERC20_ABI } from 'consts/abis';

const loadContractFrom = (contracts, contractName, signer) => {
  const address = contracts[contractName].address;
  const abi = contracts[contractName].abi;
  const bytecode = contracts[contractName].bytecode;

  const contract = new Contract(address, abi, signer);
  if (bytecode) contract.bytecode = bytecode;

  return contract;
};

export default function useContractLoader(providerOrSigner) {
  const [contracts, setContracts] = useState();
  useEffect(() => {
    async function loadContracts() {
      if (typeof providerOrSigner !== 'undefined') {
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

        const newContracts = {};

        const contractsData = require(`../contracts/250-core.deployment.json`);
        const contractList = Object.keys(contractsData);
        for (let i = 0; i < contractList.length; i += 1) {
          const contractName = contractList[i];
          try {
            newContracts[contractName] = loadContractFrom(contractsData, contractName, signer);
          } catch (e) {
            console.log(`ERROR: Contract ${contractName} cannot be loaded!`);
          }
        }
        const assetList = Object.keys(ASSETS);
        for (let i = 0; i < assetList.length; i += 1) {
          const assetName = assetList[i];
          try {
            newContracts[assetName] = new Contract(ASSETS[assetName].address, ERC20_ABI, signer);
          } catch (e) {
            console.log(`ERROR: Contract ${assetName} cannot be loaded!`);
          }
        }
        setContracts(newContracts);
      } else {
        setContracts();
      }
    }
    loadContracts();
  }, [providerOrSigner]);

  return contracts;
}
