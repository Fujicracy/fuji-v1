const chalk = require("chalk");
const ora = require("ora");
const { deployController } = require("../tasks/deployController");
const { deployFlasher } = require("../tasks/deployFlasher");
const { deployF2Fliquidator } = require("../tasks/deployFliquidator");
const { deployFujiAdmin } = require("../tasks/deployFujiAdmin");
const { deployFujiERC1155 } = require("../tasks/deployFujiERC1155");
const { deployFujiOracle } = require("../tasks/deployFujiOracle");
const { deployProvider } = require("../tasks/deployProvider");
const { deployF2Swapper } = require("../tasks/deploySwapper");
const { deployF2Vault } = require("../tasks/deployVault");
const { deployVaultHarvester } = require("../tasks/deployVaultHarvester");
const { updateController } = require("../tasks/updateController");
const { updateFlasher } = require("../tasks/updateFlasher");
const { updateFujiAdmin } = require("../tasks/updateFujiAdmin");
const { updateFujiERC1155 } = require("../tasks/updateFujiERC1155");
const { updateFujiFliquidator } = require("../tasks/updateFujiFliquidator");
const { updateVault } = require("../tasks/updateVault");
const { setDeploymentsPath, network } = require("../utils");
const { ASSETS, QUICK_ROUTER_ADDR } = require("./consts");

global.progressPrefix = __filename.split("/").pop();
global.progress = ora().start(progressPrefix + ": Starting...");
//global.console.log = (...args) => {
  //progress.text = `${progressPrefix}: ${args.join(" ")}`;
//}

const deployContracts = async () => {
  console.log("📡 Deploying...");

  const treasury = "0x40578F7902304e0e34d7069Fb487ee57F841342e";
  // Functional Contracts
  const fujiadmin = await deployFujiAdmin();
  const fliquidator = await deployF2Fliquidator();
  const flasher = await deployFlasher();
  const controller = await deployController();
  const f1155 = await deployFujiERC1155();
  const oracle = await deployFujiOracle([
    Object.values(ASSETS).map((asset) => asset.address),
    Object.values(ASSETS).map((asset) => asset.oracle),
  ]);

  // Provider Contracts
  const aaveMATIC = await deployProvider("ProviderAaveMATIC");
  const kashi = await deployProvider("ProviderKashi");
  const wepiggy = await deployProvider("ProviderWepiggy");
  const aaveV3MATIC = await deployProvider("ProviderAaveV3MATIC");

  // Deploy Core Money Handling Contracts
  // const vaultharvester = await deployVaultHarvester();
  const swapper = await deployF2Swapper([ASSETS.WMATIC.address, QUICK_ROUTER_ADDR]);

  const vaultmaticdai = await deployF2Vault("VaultMATICDAI", [
    fujiadmin,
    oracle,
    ASSETS.MATIC.address,
    ASSETS.DAI.address,
  ]);
  const vaultmaticusdc = await deployF2Vault("VaultMATICUSDC", [
    fujiadmin,
    oracle,
    ASSETS.MATIC.address,
    ASSETS.USDC.address,
  ]);

  const vaultwbtcdai = await deployF2Vault("VaultWBTCDAI", [
    fujiadmin,
    oracle,
    ASSETS.WBTC.address,
    ASSETS.DAI.address,
  ]);
  const vaultwbtcusdc = await deployF2Vault("VaultWBTCUSDC", [
    fujiadmin,
    oracle,
    ASSETS.WBTC.address,
    ASSETS.USDC.address,
  ]);

  const vaultwethdai = await deployF2Vault("VaultWETHDAI", [
    fujiadmin,
    oracle,
    ASSETS.WETH.address,
    ASSETS.DAI.address,
  ]);
  const vaultwethusdc = await deployF2Vault("VaultWETHUSDC", [
    fujiadmin,
    oracle,
    ASSETS.WETH.address,
    ASSETS.USDC.address,
  ]);

  // General Plug-ins and Set-up Transactions
  await updateFujiAdmin(fujiadmin, {
    flasher,
    fliquidator,
    treasury,
    controller,
    // vaultharvester,
    swapper,
  });

  await updateFujiFliquidator(fliquidator, {
    fujiadmin,
    oracle,
    swapper: QUICK_ROUTER_ADDR,
  });
  await updateFlasher(flasher, fujiadmin);
  await updateController(controller, fujiadmin);
  await updateFujiERC1155(f1155, [
    vaultmaticdai,
    vaultmaticusdc,
    vaultwbtcdai,
    vaultwbtcusdc,
    vaultwethdai,
    vaultwethusdc,
    fliquidator,
  ]);

  // Vault Set-up
  await updateVault("VaultMATICDAI", vaultmaticdai, {
    providers: [aaveMATIC, kashi, wepiggy, aaveV3MATIC],
    fujiadmin,
    f1155,
  });
  await updateVault("VaultMATICUSDC", vaultmaticusdc, {
    providers: [aaveMATIC, kashi, wepiggy, aaveV3MATIC],
    fujiadmin,
    f1155,
  });

  await updateVault("VaultWBTCDAI", vaultwbtcdai, {
    providers: [aaveMATIC, kashi, wepiggy, aaveV3MATIC],
    fujiadmin,
    f1155,
  });
  await updateVault("VaultWBTCUSDC", vaultwbtcusdc, {
    providers: [aaveMATIC, kashi, wepiggy, aaveV3MATIC],
    fujiadmin,
    f1155,
  });

  await updateVault("VaultWETHDAI", vaultwethdai, {
    providers: [aaveMATIC, kashi, wepiggy, aaveV3MATIC],
    fujiadmin,
    f1155,
  });
  await updateVault("VaultWETHUSDC", vaultwethusdc, {
    providers: [aaveMATIC, kashi, wepiggy, aaveV3MATIC],
    fujiadmin,
    f1155,
  });

  progress.succeed(progressPrefix);
};

const main = async () => {
  if (network !== "polygon") {
    throw new Error("Please set 'NETWORK=polygon' in ./packages/hardhat/.env");
  }

  await setDeploymentsPath("core");
  await deployContracts();
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(chalk.red(`\n${error}\n`));
    process.exit(1);
  });
