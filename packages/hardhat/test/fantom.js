const { ethers } = require("hardhat");
const { expect } = require("chai");
const { createFixtureLoader } = require("ethereum-waffle");
const { getContractAt, provider } = ethers;

const {
  formatUnitsOfCurrency,
  formatUnitsToNum,
  parseUnits,
  toBN,
  evmSnapshot,
  evmRevert,
  ZERO_ADDR,
} = require("./utils-alpha");
const { fixture, ASSETS, VAULTS } = require("./fantom-utils.js");

const fuseAddrs = {
  ftmcreamComptroller: "0x4250A6D3BD57455d7C6821eECb6206F507576cD2",
  screamComptroller: "0x260E596DAbE3AFc463e75B6CC05d8c46aCAcFB09",
};
const _vaults = {};
for (const v of VAULTS) {
  _vaults[v.name] = v;
}
const {
  vaultdaiusdc,
  vaultdaiwftm,
  vaultdaiweth,
  vaultdaiwbtc,
  vaultusdcdai,
  vaultusdcwftm,
  vaultusdcweth,
  vaultusdcwbtc,
  vaultwftmdai,
  vaultwftmusdc,
  vaultwftmweth,
  vaultwftmwbtc,
  vaultwethdai,
  vaultwethusdc,
  vaultwethwftm,
  vaultwethwbtc,
  vaultwbtcdai,
  vaultwbtcusdc,
  vaultwbtcwftm,
  vaultwbtcweth
} = _vaults;

const [DEPOSIT_ERC20, BORROW_ERC20, DEPOSIT_ETH, BORROW_ETH] = [7000, 4000, 2, 1];

describe("Fantom Fuji Instance", function () {
  let f;

  let users;
  let user1;

  let evmSnapshot0;
  let evmSnapshot1;
  let evmSnapshot2;

  before(async function () {
    users = await ethers.getSigners();
    user1 = users[1];

    const loadFixture = createFixtureLoader(users, provider);
    f = await loadFixture(fixture);
    evmSnapshot0 = await evmSnapshot();

    for (let x = 0; x < 4; x += 1) {
      const block = await provider.getBlock();
      await f.swapper
        .connect(users[x])
        .swapETHForExactTokens(
          parseUnits(10000),
          [ASSETS.WETH.address, ASSETS.DAI.address],
          users[x].address,
          block.timestamp + x + 1,
          { value: parseUnits(10) }
        );
    }
    for (let x = 0; x < 4; x += 1) {
      const block = await provider.getBlock();
      await f.swapper
        .connect(users[x])
        .swapETHForExactTokens(
          10000e6,
          [ASSETS.WETH.address, ASSETS.USDC.address],
          users[x].address,
          block.timestamp + x + 1,
          { value: parseUnits(10) }
        );
    }
    for (let x = 0; x < 4; x += 1) {
      const block = await provider.getBlock();
      await f.swapper
        .connect(users[x])
        .swapETHForExactTokens(
          parseUnits(10000),
          [ASSETS.WETH.address, ASSETS.FEI.address],
          users[x].address,
          block.timestamp + x + 1,
          { value: parseUnits(10) }
        );
    }

    evmSnapshot1 = await evmSnapshot();
  });

  beforeEach(async function () {
    if (evmSnapshot2) await evmRevert(evmSnapshot2);

    evmSnapshot2 = await evmSnapshot();
  });

  after(async function () {
    evmRevert(evmSnapshot0);
  });

  describe("Pool 3", function () {
    before(async function () {
      //evmRevert(evmSnapshot1);

      for (let i = 0; i < VAULTS.length; i += 1) {
        const vault = VAULTS[i];
        await f[vault.name].setProviders([f.fuse3.address]);
        await f[vault.name].setActiveProvider(f.fuse3.address);
      }
    });

    testDeposit1(fuseAddrs.fuse3Comptroller, [vaultethdai, vaultethusdc]);
    testDeposit2(fuseAddrs.fuse3Comptroller, [vaultdaiusdc, vaultusdcdai]);

    testBorrow1([vaultethdai, vaultethusdc]);
    testBorrow2([vaultdaiusdc, vaultusdcdai]);
    testBorrow3([vaultdaieth]);

    testPaybackAndWithdraw1([vaultethdai, vaultethusdc]);
    testPaybackAndWithdraw2([vaultdaiusdc, vaultusdcdai]);
    testPaybackAndWithdraw3([vaultdaieth]);

    testRefinance1([vaultethusdc, vaultethdai], "fuse3", "fuse18", 1);
    testRefinance2([vaultusdcdai], "fuse3", "fuse18", 1);
    testRefinance3([vaultdaieth], "fuse3", "fuse18", 1);
  });

  describe("Pool 6", function () {
    before(async function () {
      // REVERT to 2
      evmRevert(evmSnapshot2);

      for (let i = 0; i < VAULTS.length; i += 1) {
        const vault = VAULTS[i];
        await f[vault.name].setProviders([f.fuse6.address]);
        await f[vault.name].setActiveProvider(f.fuse6.address);
      }
    });

    testDeposit1(fuseAddrs.fuse6Comptroller, [vaultethdai, vaultethusdc, vaultethfei]);
    testDeposit2(fuseAddrs.fuse6Comptroller, [
      vaultdaiusdc,
      vaultusdcdai,
      vaultdaiusdt,
      vaultdaieth,
    ]);

    testBorrow1([vaultethdai, vaultethusdc, vaultethfei]);
    testBorrow2([vaultdaiusdc, vaultusdcdai]);
    // borrowing ETH is paused on this pool
    //testBorrow3([vaultdaieth, vaultfeieth]);

    testPaybackAndWithdraw1([vaultethdai, vaultethusdc, vaultethfei]);
    testPaybackAndWithdraw2([vaultdaiusdc, vaultusdcdai]);
    // borrowing ETH is paused on this pool
    //testPaybackAndWithdraw3([vaultdaieth, vaultfeieth]);

    testRefinance1([vaultethfei, vaultethusdc], "fuse6", "fuse18", 2);
    testRefinance2([vaultusdcdai], "fuse6", "fuse18", 1);
    // borrowing ETH is paused on this pool
    //testRefinance3([vaultdaieth], "fuse6", "fuse18", 1);
  });

  describe("Pool 7", function () {
    before(async function () {
      // REVERT to 2
      evmRevert(evmSnapshot2);

      for (let i = 0; i < VAULTS.length; i += 1) {
        const vault = VAULTS[i];
        await f[vault.name].setProviders([f.fuse7.address]);
        await f[vault.name].setActiveProvider(f.fuse7.address);
      }
    });

    testDeposit1(fuseAddrs.fuse7Comptroller, [vaultethusdc, vaultethfei]);
    testDeposit2(fuseAddrs.fuse7Comptroller, [vaultfeiusdc, vaultusdcfei]);

    testBorrow1([vaultethusdc, vaultethfei]);
    testBorrow2([vaultfeiusdc, vaultusdcfei]);
    // borrowing ETH is paused on this pool
    //testBorrow3([vaultdaieth, vaultfeieth]);

    testPaybackAndWithdraw1([vaultethusdc, vaultethfei]);
    testPaybackAndWithdraw2([vaultfeiusdc, vaultusdcfei]);
    // borrowing ETH is paused on this pool
    //testPaybackAndWithdraw3([vaultdaieth, vaultfeieth]);

    testRefinance1([vaultethfei, vaultethusdc], "fuse7", "fuse18", 2);
    testRefinance2([vaultusdcfei], "fuse7", "fuse18", 2);
    // borrowing ETH is paused on this pool
    //testRefinance3([vaultfeieth], "fuse7", "fuse18", 1);
  });

  describe("Pool 8", function () {
    before(async function () {
      // REVERT to 2
      evmRevert(evmSnapshot2);

      for (let i = 0; i < VAULTS.length; i += 1) {
        const vault = VAULTS[i];
        await f[vault.name].setProviders([f.fuse8.address]);
        await f[vault.name].setActiveProvider(f.fuse8.address);
      }
    });

    testDeposit1(fuseAddrs.fuse8Comptroller, [vaultethdai, vaultethfei]);
    testDeposit2(fuseAddrs.fuse8Comptroller, [vaultfeidai, vaultdaifei]);

    testBorrow1([vaultethdai, vaultethfei]);
    testBorrow2([vaultfeidai, vaultdaifei]);
    testBorrow3([vaultdaieth, vaultfeieth]);

    testPaybackAndWithdraw1([vaultethdai, vaultethfei]);
    testPaybackAndWithdraw2([vaultfeidai, vaultdaifei]);
    testPaybackAndWithdraw3([vaultdaieth, vaultfeieth]);

    testRefinance1([vaultethfei, vaultethdai], "fuse8", "fuse18", 2);
    testRefinance2([vaultdaifei, vaultfeidai], "fuse8", "fuse18", 2);
    testRefinance3([vaultdaieth, vaultfeieth], "fuse8", "fuse18", 1);
  });

  describe("Pool 18", function () {
    before(async function () {
      // REVERT to 2
      evmRevert(evmSnapshot2);

      for (let i = 0; i < VAULTS.length; i += 1) {
        const vault = VAULTS[i];
        await f[vault.name].setProviders([f.fuse18.address]);
        await f[vault.name].setActiveProvider(f.fuse18.address);
      }
    });

    testDeposit1(fuseAddrs.fuse18Comptroller, [vaultethdai, vaultethusdc, vaultethfei]);
    testDeposit2(fuseAddrs.fuse18Comptroller, [
      vaultdaiusdc,
      vaultusdcdai,
      vaultdaiusdt,
      vaultdaieth,
    ]);

    testBorrow1([vaultethdai, vaultethusdc, vaultethfei]);
    testBorrow2([vaultdaiusdc, vaultusdcdai]);
    testBorrow3([vaultdaieth, vaultfeieth]);

    testPaybackAndWithdraw1([vaultethdai, vaultethusdc, vaultethfei]);
    testPaybackAndWithdraw2([vaultdaiusdc, vaultusdcdai]);
    testPaybackAndWithdraw3([vaultdaieth, vaultfeieth]);

    testRefinance1([vaultethfei, vaultethusdc], "fuse18", "fuse6", 2);
    testRefinance2([vaultusdcdai], "fuse18", "fuse3", 1);
    testRefinance3([vaultdaieth, vaultfeieth], "fuse18", "fuse8", 2);
  });
});
