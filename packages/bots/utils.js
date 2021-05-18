const axios = require('axios');
const { Contract } = require('ethers');
const fs = require("fs");

const loadSingleContract = (contractName, signer) => {
  const newContract = new Contract(
    require(`./contracts/${contractName}.address.js`),
    require(`./contracts/${contractName}.abi.js`),
    signer,
  );
  try {
    newContract.bytecode = require(`./contracts/${contractName}.bytecode.js`);
  } catch (e) {
    console.log(e);
  }
  return newContract;
};

const getContractsList = () => {
  return fs.readdirSync('./contracts')
    .filter(file => file.match(/.*\.address\.js$/))
    .map(file => {
      return file.split('.')[0];
    });
}

async function loadContracts(providerOrSigner) {
  try {
    // we need to check to see if this providerOrSigner has a signer or not
    let signer;
    let accounts;
    if (providerOrSigner && typeof providerOrSigner.listAccounts === "function") {
      accounts = await providerOrSigner.listAccounts();
    }

    if (accounts && accounts.length > 0) {
      signer = providerOrSigner.getSigner();
    } else {
      signer = providerOrSigner;
    }

    const contractList = getContractsList();

    const newContracts = contractList.reduce((accumulator, contractName) => {
      accumulator[contractName] = loadSingleContract(contractName, signer);
      return accumulator;
    }, {});

    return newContracts;
  } catch (e) {
    console.log("ERROR LOADING CONTRACTS!!", e);
  }
}

async function getGasPrice(speed) {
  return axios
    .get('https://ethgasstation.info/json/ethgasAPI.json')
    .then(response => {
      return response.data[speed || 'fastest'] * 100000000;
    })
    .catch(error => console.log(error));
}

module.exports = {
  loadContracts,
  loadSingleContract,
  getGasPrice,
};
