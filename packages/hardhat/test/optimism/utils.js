const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

const { getContractAt, getContractFactory } = ethers;

const ZIPSWAP_ROUTER_ADDR = "0xE6Df0BB08e5A97b40B21950a0A51b94c4DbA0Ff6";
const TREASURY_ADDR = "0x89c1E94F47c4e3a374B5a98455468f27CA2b2544"; // Deployer

const DEBUG = false;

const ASSETS = {
  ETH: {
    name: "eth",
    nameUp: "ETH",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    oracle: "0x13e3Ee699D1909E989722E753853AE30b17e08c5",
    aTokenV3: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
    decimals: 18,
  },
  DAI: {
    name: "dai",
    nameUp: "DAI",
    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    oracle: "0x8dBa75e83DA73cc766A7e5a0ee71F656BAb470d6",
    aTokenV3: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
    decimals: 18,
  },
  USDC: {
    name: "usdc",
    nameUp: "USDC",
    address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    oracle: "0x16a9FA2FDa030272Ce99B29CF780dFA30361E0f3",
    aTokenV3: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
    decimals: 6,
  },
  WETH: {
    name: "weth",
    nameUp: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    oracle: "0x13e3Ee699D1909E989722E753853AE30b17e08c5",
    aTokenV3: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
    decimals: 18,
  },
  WBTC: {
    name: "wbtc",
    nameUp: "WBTC",
    address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    oracle: "0xD702DD976Fb76Fffc2D3963D037dfDae5b04E593",
    aTokenV3: "0x078f358208685046a11C85e8ad32895DED33A249",
    decimals: 8,
  },
};

// iterate through all ASSETS and create pairs
const getVaults = () => {
  const assets = Object.values(ASSETS);
  const vaults = [];
  assets.forEach((collateral, i1) => {
    assets.forEach((debt, i2) => {
      if (i1 !== i2) {
        vaults.push({
          name: `vault${collateral.name}${debt.name}`,
          collateral,
          debt,
        });
      }
    });
  });
  return vaults;
};

// console.log(getVaults());

const fixture = async ([wallet]) => {
  // Step 0: Common
  const tokens = {};
  for (const asset in ASSETS) {
    tokens[`${ASSETS[asset].name}`] = await getContractAt("IERC20", ASSETS[asset].address);
  }
  const swapper = await getContractAt("IUniswapV2Router02", ZIPSWAP_ROUTER_ADDR);
  const optimismUnwrapper = await getContractAt(
    "contracts/interfaces/IWETH.sol:IWETH",
    ASSETS.WETH.address
  );

  // Step 1: Base Contracts
  const FujiAdmin = await getContractFactory("FujiAdmin");
  const fujiadmin = await upgrades.deployProxy(FujiAdmin, []);

  const Fliquidator = await getContractFactory("F2Fliquidator");
  const fliquidator = await Fliquidator.deploy([]);

  //const Flasher = await getContractFactory("FlasherOptimism");
  //const flasher = await Flasher.deploy([]);

  const Controller = await getContractFactory("Controller");
  const controller = await Controller.deploy([]);

  const F1155 = await getContractFactory("FujiERC1155");
  const f1155 = await upgrades.deployProxy(F1155, []);

  const FujiOracle = await getContractFactory("FujiOracle");
  const oracle = await FujiOracle.deploy(
    Object.values(ASSETS).map((asset) => asset.address),
    Object.values(ASSETS).map((asset) => asset.oracle)
  );

  // Step 2: Providers
  const ProviderAaveV3Optimism = await getContractFactory("ProviderAaveV3Optimism");
  const aavev3 = await ProviderAaveV3Optimism.deploy([]);
  const ProviderWePiggyOptimism = await getContractFactory("ProviderWePiggyOptimism");
  const wepiggy = await ProviderWePiggyOptimism.deploy([]);

  // Log if debug is set true
  if (DEBUG) {
    console.log("fujiadmin", fujiadmin.address);
    console.log("fliquidator", fliquidator.address);
    //console.log("flasher", flasher.address);
    console.log("controller", controller.address);
    console.log("f1155", f1155.address);
    console.log("oracle", oracle.address);
    console.log("aavev3", aavev3.address);
    console.log("wepiggy", wepiggy.address);
  }

  // Setp 3: Vaults
  const FujiVault = await getContractFactory("F2FujiVault");
  // deploy a vault for each entry in ASSETS
  const vaults = {};
  for (const { name, collateral, debt } of getVaults()) {
    const vault = await upgrades.deployProxy(FujiVault, [
      fujiadmin.address,
      oracle.address,
      collateral.address,
      debt.address,
    ]);

    if (DEBUG) {
      console.log(name, vault.address);
    }

    await f1155.setPermit(vault.address, true);
    await vault.setFujiERC1155(f1155.address);
    await fujiadmin.allowVault(vault.address, true);
    await vault.setProviders([aavev3.address, wepiggy.address]);

    vaults[name] = vault;
  }

  // Step 4: Setup
  //await fujiadmin.setFlasher(flasher.address);
  await fujiadmin.setFliquidator(fliquidator.address);
  await fujiadmin.setTreasury(TREASURY_ADDR);
  await fujiadmin.setController(controller.address);
  await fliquidator.setFujiAdmin(fujiadmin.address);
  await fliquidator.setSwapper(ZIPSWAP_ROUTER_ADDR);
  //await flasher.setFujiAdmin(fujiadmin.address);
  await controller.setFujiAdmin(fujiadmin.address);
  await f1155.setPermit(fliquidator.address, true);

  return {
    ...tokens,
    ...vaults,
    aavev3,
    wepiggy,
    oracle,
    fujiadmin,
    fliquidator,
    //flasher,
    controller,
    f1155,
    swapper,
    optimismUnwrapper,
  };
};

module.exports = {
  fixture,
  ASSETS,
  VAULTS: getVaults(),
};
