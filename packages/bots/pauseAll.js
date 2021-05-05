require('dotenv').config();

const fs = require("fs");
const { ethers, Wallet, Signer } = require('ethers');
const { loadSingleContract } = require('./utils');

// BOT Set-up

const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER_URL);

let signer;

if (process.env.PRIVATE_KEY) {
  signer = new Wallet(process.env.PRIVATE_KEY, provider);
}
else {
  throw new Error('PRIVATE_KEY not set: please, set it in ".env"!');
}

const vaultsList = [
  'VaultETHDAI',
  'VaultETHUSDC'
];

const TIMES_FACTOR = 3;

// ACTION FUNCTIONS

async function pauseAllContracts(_vaultsList, _signer, _gasPrice) {
  let vaultContracts = [];
  for (var i = 0; i < _vaultsList.length; i++) {
    vaultContracts[i] = loadSingleContract(_vaultsList[i],_signer);
    await vaultContracts[i].connect(_signer).pause( {gasPrice:_gasPrice});
  }

}

// CONDITION CHECK FUNCTIONS

async function getAbnormalAmounts() {
  let alphawhitelist = loadSingleContract("AlphaWhitelist",_signer);
  let withdrawAlertAmount = await alphawhitelist.ETH_CAP_VALUE();
  withdrawAlertAmount = withdrawAlertAmount.mul(TIMES_FACTOR);

  let oracle = loadSingleContract("AggregatorV3Interface",_signer); // This needs to be address: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419

  let borrowAlertAmount = await oracle.latestRoundData();
  borrowAlertAmount = borrowAlertAmount.mul(TIMES_FACTOR);

  return  withdrawAlertAmount,borrowAlertAmount;
}

async function checkAbnormalTransaction(){

  for (let v = 0; v < vaultsList.length; v++) {

  }

}
