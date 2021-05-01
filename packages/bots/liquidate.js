require('dotenv').config();

const fs = require("fs");
const { ethers, Wallet, Signer } = require('ethers');
const { loadContracts } = require('./utils');

const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER_URL);
const signer = new Wallet(process.env.PRIVATE_KEY, provider);

const vaultsList = [
  'VaultETHDAI',
  'VaultETHUSDC',
];
const DAI_ADDR = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

async function getLiquidationProviderIndex(vaultName, contracts) {
  const providerIndex = {
    'aave': '0',
    'dydx': '1',
  };
  const { borrowAsset } = await contracts[vaultName].vAssets();
  const activeProvider = await contracts[vaultName].activeProvider();
  const dydxProviderAddr = contracts.ProviderDYDX.address;

  if ([DAI_ADDR, USDC_ADDR].includes(borrowAsset) && activeProvider !== dydxProviderAddr) {
    return providerIndex['dydx'];
  }
  return providerIndex['aave'];
}

async function checkUserPosition(addr, vaultName, contracts) {
  console.log(`Checking ${addr} position in ${vaultName}:`);
  const { borrowID, collateralID } = await contracts[vaultName].vAssets();

  const collateralBalance = await contracts.FujiERC1155.balanceOf(addr, collateralID);
  const borrowBalance = await contracts.FujiERC1155.balanceOf(addr, borrowID);

  const neededCollateral = await contracts[vaultName]
    .getNeededCollateralFor(borrowBalance, "true");

  if (collateralBalance.lt(neededCollateral)) {
    console.log('-> proceed to liquidation');
    const index = await getLiquidationProviderIndex(vaultName, contracts);
    await contracts.Fliquidator.connect(signer).flashLiquidate(addr, contracts[vaultName].address, index)
      .catch(e => {
        console.log(e);
        //const body = JSON.parse(e.body);
        //const { message } = body.error;
        //console.log(`----> Liquidation failed: ${message}`);
      });
  }
  else {
    console.log('-> position is safe');
  }
}

async function checkForLiquidations() {
  const contracts = await loadContracts(signer);

  for (let v = 0; v < vaultsList.length; v++) {
    const vaultName = vaultsList[v];
    const filterBorrowers = contracts[vaultName].filters.Borrow();
    const events = await contracts[vaultName].queryFilter(filterBorrowers, -10);
    const borrowers = events
      .map(e => e.args.userAddrs)
      .reduce( (acc, userAddr) => (
        acc.includes(userAddr) ? acc : [...acc, userAddr]
      ), []);

    for (let i = 0; i < borrowers.length; i++) {
      const borrower = borrowers[i];
      await checkUserPosition(borrower, vaultName, contracts);
    }
  }
}

function main() {
  console.log('Start checking for liquidations...');
  setInterval(checkForLiquidations, 60000);
}

main();
