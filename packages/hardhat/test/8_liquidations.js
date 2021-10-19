const { ethers } = require("hardhat");
const { expect } = require("chai");
const { createFixtureLoader } = require("ethereum-waffle");

const { getContractAt, provider } = ethers;

const {
  parseUnits,
  evmSnapshot,
  evmRevert,
  FLASHLOAN,
  removeItemOnce
} = require("./helpers");

const {
  testBatchLiquidate1,
  testBatchLiquidate2,
  testflashBatchLiquidate1
} = require("./Fliquidator.js");

const { fixture, VAULTS, ASSETS } = require("./core-utils");

const vaults = {};
for (const v of VAULTS) {
  vaults[v.name] = v;
}

const {
  vaultethdai,
  vaultethusdc,
  vaultethusdt,
  vaultethwbtc,
  vaultwbtceth,
  vaultwbtcdai,
  vaultwbtcusdc,
  vaultwbtcusdt,
  vaultdaieth,
  vaultdaiwbtc,
  vaultusdceth,
  vaultusdcwbtc,
  vaultusdteth,
  vaultusdtwbtc,
} = vaults;

const [DEPOSIT_STABLE, DEPOSIT_ETH, DEPOSIT_WBTC] = [500, 0.1, 0.0075];

const [BORROW_STABLE, BORROW_ETH, BORROW_WBTC] = [
  DEPOSIT_STABLE / 2,
  DEPOSIT_ETH / 2,
  DEPOSIT_WBTC / 2,
];

const PROVIDER_NAMES = [
  'aave',
  'compound',
  'dydx',
  'ironBank'
];

describe("Core Fuji Instance", function () {
  before(async function () {

    this.nativeToken = "eth";

    this.users = await ethers.getSigners();
    this.owner = this.users[0];
    this.liquidatorUser = this.users[1];
    this.carelessUsers = [this.users[2], this.users[3], this.users[4]];
    this.goodUsers =[this.users[5], this.users[6]];

    const loadFixture = createFixtureLoader(this.users, provider);
    this.f = await loadFixture(fixture);

    this.fujiProviders = [await this.f.aave, await this.f.compound, await this.f.dydx, await this.f.ironBank];
    this.evmSnapshot0 = await evmSnapshot();

    for (let x = 0; x < 7; x += 1) {
      const block = await provider.getBlock();
      await this.f.swapper
        .connect(this.users[x])
        .swapETHForExactTokens(
          parseUnits(DEPOSIT_STABLE),
          [ASSETS.WETH.address, ASSETS.DAI.address],
          this.users[x].address,
          block.timestamp + 60,
          { value: parseUnits(10) }
        );
      await this.f.swapper
        .connect(this.users[x])
        .swapETHForExactTokens(
          parseUnits(DEPOSIT_STABLE, 6),
          [ASSETS.WETH.address, ASSETS.USDC.address],
          this.users[x].address,
          block.timestamp + 60,
          { value: parseUnits(10) }
        );
      await this.f.swapper
        .connect(this.users[x])
        .swapETHForExactTokens(
          parseUnits(DEPOSIT_STABLE, 6),
          [ASSETS.WETH.address, ASSETS.USDT.address],
          this.users[x].address,
          block.timestamp + 60,
          { value: parseUnits(10) }
        );
      await this.f.swapper
        .connect(this.users[x])
        .swapETHForExactTokens(
          parseUnits(DEPOSIT_WBTC, 8),
          [ASSETS.WETH.address, ASSETS.WBTC.address],
          this.users[x].address,
          block.timestamp + 60,
          { value: parseUnits(10) }
        );
    }
  });

  beforeEach(async () => {
    if (this.evmSnapshot1) await evmRevert(this.evmSnapshot1);
    this.evmSnapshot1 = await evmSnapshot();
  });

  after(async () => {
    evmRevert(this.evmSnapshot0);
  });

  describe("Testing Liquidation Functions in Fliquidator", () => {

    for (var i = 0; i < PROVIDER_NAMES.length; i++) {
      testBatchLiquidate1(
        [vaultethdai, vaultethusdc],
        PROVIDER_NAMES[i],
        BORROW_STABLE
      );
      testBatchLiquidate2(
        [vaultdaieth, vaultusdceth],
        PROVIDER_NAMES[i],
        BORROW_ETH
      );
      testflashBatchLiquidate1(
        [vaultethdai, vaultethusdc],
        PROVIDER_NAMES[i],
        BORROW_STABLE
      );
      testflashBatchLiquidate1(
        [vaultdaieth, vaultusdceth],
        PROVIDER_NAMES[i],
        BORROW_ETH
      );
    }

    const specificProviders = removeItemOnce(PROVIDER_NAMES, 'dydx');

    for (var i = 0; i < specificProviders.length; i++) {
      testBatchLiquidate1(
        [vaultwbtcdai, vaultwbtcusdc, vaultwbtcusdt],
        specificProviders[i],
        BORROW_STABLE
      );
      testBatchLiquidate2(
        [vaultwbtceth, vaultdaieth, vaultusdteth],
        specificProviders[i],
        BORROW_ETH
      );
      testflashBatchLiquidate1(
        [vaultwbtcdai, vaultwbtcusdc, vaultwbtcusdt],
        specificProviders[i],
        BORROW_STABLE
      );
      testflashBatchLiquidate1(
        [vaultwbtceth, vaultdaieth, vaultusdteth],
        specificProviders[i],
        BORROW_ETH
      );
    }

  });
});
