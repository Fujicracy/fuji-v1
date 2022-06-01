/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { Contract } from '@ethersproject/contracts';
import { useState, useEffect, useRef } from 'react';
import { ASSETS } from 'consts/assets';
import { ERC20_ABI } from 'consts/abis';
import { useAuth } from './Auth';

const loadContractFrom = (contracts, contractName, signer) => {
  const address = contracts[contractName].address;
  const abi = contracts[contractName].abi;
  const bytecode = contracts[contractName].bytecode;

  const contract = new Contract(address, abi, signer);
  if (bytecode) contract.bytecode = bytecode;

  return contract;
};

export function useContractLoader() {
  const { provider: providerOrSigner, networkId, networkName, deployment } = useAuth();
  const isMounted = useRef(false);

  const [contracts, setContracts] = useState();

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function loadContracts() {
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

        const newContracts = {};

        const contractsData = require(`../contracts/${networkId}-${deployment}.deployment.json`);
        const contractList = Object.keys(contractsData);
        for (let i = 0; i < contractList.length; i += 1) {
          const contractName = contractList[i];
          try {
            newContracts[contractName] = loadContractFrom(contractsData, contractName, signer);
          } catch (e) {
            console.log(`ERROR: Contract ${contractName} cannot be loaded!`);
          }
        }
        const assetList = Object.values(ASSETS[networkName]);
        for (let i = 0; i < assetList.length; i += 1) {
          const asset = assetList[i];
          try {
            newContracts[asset.name] = new Contract(asset.address, ERC20_ABI, signer);
          } catch (e) {
            console.log(`ERROR: Contract ${asset.name} cannot be loaded!`);
          }
        }
        if (isMounted.current) {
          setContracts(newContracts);
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (providerOrSigner && networkId) loadContracts();
  }, [providerOrSigner, networkId, networkName, deployment]);

  return contracts;
}
