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

    const contractList = require("./contracts/contracts.js");

    const newContracts = contractList.reduce((accumulator, contractName) => {
      accumulator[contractName] = loadSingleContract(contractName, signer);
      return accumulator;
    }, {});

    return newContracts;
  } catch (e) {
    console.log("ERROR LOADING CONTRACTS!!", e);
  }
}

module.exports = {
  loadContracts,
  loadSingleContract
};
