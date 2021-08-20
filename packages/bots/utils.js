const axios = require('axios');
const { Contract } = require('ethers');
const fs = require('fs');

const DAI_ADDR = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const USDC_ADDR = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const CHAIN_ID = process.env.CHAIN_ID || 1;
const DEPLOYMENT = process.env.DEPLOYMENT || 'core';

const loadContractFrom = (contracts, contractName, signer) => {
  const address = contracts[contractName].address;
  const abi = contracts[contractName].abi;
  const bytecode = contracts[contractName].bytecode;

  const contract = new Contract(address, abi, signer);
  if (bytecode) contract.bytecode = bytecode;

  return contract;
};

const loadContracts = async providerOrSigner => {
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

    const contractsData = require(`./contracts/${CHAIN_ID}-${DEPLOYMENT}.deployment.json`);
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

const getGasPrice = async speed => {
  return axios
    .get('https://ethgasstation.info/json/ethgasAPI.json')
    .then(({ data }) => {
      return data[speed || 'fastest'] * 100000000;
    })
    .catch(error => console.log(error));
};

const getETHPrice = async () => {
  return axios
    .get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    .then(({ data }) => data.ethereum.usd);
};

const getLiquidationProviderIndex = async (vault, contracts) => {
  const providerIndex = {
    aave: 0,
    dydx: 1,
    cream: 2,
  };
  const { borrowAsset } = await vault.vAssets();
  const activeProvider = await vault.activeProvider();
  const dydxProviderAddr = contracts.ProviderDYDX.address;

  if ([DAI_ADDR, USDC_ADDR].includes(borrowAsset) && activeProvider !== dydxProviderAddr) {
    // use dydx flashloans when underlying asset is DAI or USDC and
    // current activeProvider is not dYdX
    return providerIndex.dydx;
  }
  return providerIndex.cream;
};

module.exports = {
  DAI_ADDR,
  USDC_ADDR,
  loadContracts,
  getGasPrice,
  getETHPrice,
  getLiquidationProviderIndex,
};
