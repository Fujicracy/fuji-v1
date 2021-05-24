const axios = require('axios');
const { Contract } = require('ethers');
const fs = require('fs');

const DAI_ADDR = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const USDC_ADDR = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

const loadSingleContract = (contractName, signer) => {
  const newContract = new Contract(
    // eslint-disable-next-line
    require(`./contracts/${contractName}.address.js`),
    // eslint-disable-next-line
    require(`./contracts/${contractName}.abi.js`),
    signer,
  );
  try {
    // eslint-disable-next-line
    newContract.bytecode = require(`./contracts/${contractName}.bytecode.js`);
  } catch (e) {
    console.log(e);
  }
  return newContract;
};

const getContractsList = () => {
  return fs
    .readdirSync('./contracts')
    .filter(file => file.match(/.*\.address\.js$/))
    .map(file => {
      return file.split('.')[0];
    });
};

async function loadContracts(providerOrSigner) {
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

    const contractList = getContractsList();

    newContracts = contractList.reduce((accumulator, contractName) => {
      accumulator[contractName] = loadSingleContract(contractName, signer);
      return accumulator;
    }, {});
  } catch (e) {
    console.log('ERROR LOADING CONTRACTS!!', e);
  }

  return newContracts;
}

async function getGasPrice(speed) {
  return axios
    .get('https://ethgasstation.info/json/ethgasAPI.json')
    .then(response => {
      return response.data[speed || 'fastest'] * 100000000;
    })
    .catch(error => console.log(error));
}

async function getLiquidationProviderIndex(vault, contracts) {
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
}

module.exports = {
  DAI_ADDR,
  USDC_ADDR,
  loadContracts,
  loadSingleContract,
  getGasPrice,
  getLiquidationProviderIndex,
};
