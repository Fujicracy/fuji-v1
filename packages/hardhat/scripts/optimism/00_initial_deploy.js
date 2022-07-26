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
const { ASSETS, ZIPSWAP_ROUTER_ADDR } = require("./consts");

global.progressPrefix = __filename.split("/").pop();
global.progress = ora().start(progressPrefix + ": Starting...");
global.console.log = (...args) => {
  progress.text = `${progressPrefix}: ${args.join(" ")}`;
}

const deployContracts = async () => {
  console.log("📡 Deploying...");

  const treasury = "0x89c1E94F47c4e3a374B5a98455468f27CA2b2544";
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
  const aaveV3Optimism = await deployProvider("ProviderAaveV3Optimism");
  const dForceOptimism = await deployProvider("ProviderDForceOptimism");
  const wepiggyOptimism = await deployProvider("ProviderWePiggyOptimism");

  // Deploy Core Money Handling Contracts
  // const vaultharvester = await deployVaultHarvester();
  const swapper = await deployF2Swapper([ASSETS.WETH.address, ZIPSWAP_ROUTER_ADDR]);

  const vaultethusdc = await deployF2Vault("VaultETHUSDC", [
    fujiadmin,
    oracle,
    ASSETS.ETH.address,
    ASSETS.USDC.address,
  ]);

  const vaultusdceth = await deployF2Vault("VaultUSDCETH", [
    fujiadmin,
    oracle,
    ASSETS.USDC.address,
    ASSETS.ETH.address,
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
    swapper: ZIPSWAP_ROUTER_ADDR,
  });
  await updateFlasher(flasher, fujiadmin);
  await updateController(controller, fujiadmin);
  await updateFujiERC1155(f1155, [
    vaultethusdc,
    vaultusdceth,
    fliquidator,
  ]);

  // Vault Set-up
  await updateVault("VaultETHUSDC", vaultethusdc, {
    providers: [aaveV3Optimism, dForceOptimism],
    fujiadmin,
    f1155,
  });

  await updateVault("VaultUSDCETH", vaultusdceth, {
    providers: [aaveV3Optimism, dForceOptimism, wepiggyOptimism],
    fujiadmin,
    f1155,
  });

  progress.succeed(progressPrefix);
};

const main = async () => {
  if (network !== "optimism") {
    throw new Error("Please set 'NETWORK=optimism' in ./packages/hardhat/.env");
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
