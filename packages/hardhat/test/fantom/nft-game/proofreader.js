const { ethers } = require("hardhat");
const { expect } = require('chai');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');


const abiCoder = ethers.utils.defaultAbiCoder;

const DEBUG = true;

describe("Show extraction Steps", function () {

  let accounts;

  let ProofReader;
  let leaves;
  let merkletree;
  let merkleroot;
  let proofreader;

  before(async () => {
    accounts = await ethers.getSigners();

    ProofReader = await ethers.getContractFactory('ProofReader');
    leaves = require('./sample-merkle-leaves.json');
    merkletree = new MerkleTree(leaves, keccak256, { hashLeaves: true, sortPairs: true });
    merkleroot = merkletree.getHexRoot();
    proofreader = await ProofReader.deploy(merkleroot);
  });

  it('Read datasize with no passed proof', async () => {
    const datasize = await proofreader.connect(accounts[0]).tryGetthePoints();
    if (DEBUG) {
      console.log("datasize", datasize);
    }
    expect(datasize).to.be.gt(0);
  });

  it.only('Read datasize with passed proof', async () => {
    let proof = merkletree.getHexProof(keccak256(leaves[0]));
    proof = abiCoder.encode(['bytes32[]'], [proof]);
    let utx = await proofreader.connect(accounts[0]).populateTransaction.tryGetthePoints();
    if (DEBUG) {
      console.log("proof", proof);
      console.log("utx", utx);
    }
    utx.data = utx.data + 
  });

});

