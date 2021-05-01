const fs = require("fs");
const { ethers, Contract } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider();

const f1155_ADDR = fs.readFileSync('../hardhat/artifacts/FujiERC1155.address').toString();
const f1155_ABI = require('../hardhat/artifacts/contracts/FujiERC1155/FujiERC1155.sol/FujiERC1155.json').abi;
const f1155 = new Contract(f1155_ADDR, f1155_ABI, provider);

const fliquidator_ADDR = fs.readFileSync('../hardhat/artifacts/Fliquidator.address').toString();
const fliquidator_ABI = require('../hardhat/artifacts/contracts/Fliquidator.sol/Fliquidator.json').abi;
const fliquidator = new Contract(fliquidator_ADDR, fliquidator_ABI, provider);

const vaultETHDAI_ADDR = fs.readFileSync('../hardhat/artifacts/VaultETHDAI.address').toString();
const vaultETHDAI_ABI = require('../hardhat/artifacts/contracts/Vaults/VaultETHDAI.sol/VaultETHDAI.json').abi;
const vaultETHDAI = new Contract(vaultETHDAI_ADDR, vaultETHDAI_ABI, provider);


const filterBorrowers = vaultETHDAI.filters.Borrow();

async function checkUserPosition(addr, vault) {
  const { borrowAsset, collateralAsset, borrowID, collateralID } = await vault.vAssets();

  const collateralBalance = await f1155.balanceOf(addr, collateralID);
  const borrowBalance = await f1155.balanceOf(addr, borrowID);

  const neededCollateral = await vault.getNeededCollateralFor(borrowBalance, "true");
  console.log(collateralBalance.lt(neededCollateral));

  if (collateralBalance.lt(neededCollateral)) {
    await fliquidator.flashLiquidate(addr, vault.address, "1");
  }
}

async function listenForEvents() {
  console.log('start filter ...');
  const events = await vaultETHDAI.queryFilter(filterBorrowers, -10);
  const borrowers = events.map(e => e.args.userAddrs);

  for (let i = 0; i < borrowers.length; i++) {
    await checkUserPosition(borrowers[i], vaultETHDAI);
  }
}

listenForEvents();
