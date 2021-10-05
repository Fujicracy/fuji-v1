const { ethers } = require("hardhat");
const { expect } = require("chai");
const { createFixtureLoader } = require("ethereum-waffle");

const { getContractAt, provider } = ethers;

const {
  formatUnitsToNum,
  parseUnits,
  toBN,
  evmSnapshot,
  evmRevert,
  ZERO_ADDR,
} = require("./v0-utils");

const {
  fixture,
  ASSETS,
  VAULTS,
  testDeposit1,
  testDeposit2,
  testBorrow1,
  testBorrow2,
  testBorrow3,
  testPaybackAndWithdraw1,
  testPaybackAndWithdraw2,
  testPaybackAndWithdraw3,
  testRefinance1,
} = require("./fantom-utils");

const ftmAddrs = {
  ftmcreamComptroller: "0x4250A6D3BD57455d7C6821eECb6206F507576cD2",
  ftmcreamMapper: "0x1eEdE44b91750933C96d2125b6757C4F89e63E20",
  screamComptroller: "0x260E596DAbE3AFc463e75B6CC05d8c46aCAcFB09",
  screamMapper: "0xA9c29eA1a067740be6dB1F98FcbA0043C475041A",
};

const vaults = {};
for (const v of VAULTS) {
  vaults[v.name] = v;
}
const {
  vaultftmdai,
  vaultftmusdc,
  vaultftmweth,
  vaultftmwbtc,
  vaultdaiftm,
  vaultdaiusdc,
  vaultdaiwftm,
  vaultdaiweth,
  vaultdaiwbtc,
  vaultusdcftm,
  vaultusdcdai,
  vaultusdcwftm,
  vaultusdcweth,
  vaultusdcwbtc,
  vaultwftmdai,
  vaultwftmusdc,
  vaultwftmweth,
  vaultwftmwbtc,
  vaultwethftm,
  vaultwethdai,
  vaultwethusdc,
  vaultwethwftm,
  vaultwethwbtc,
  vaultwbtcftm,
  vaultwbtcdai,
  vaultwbtcusdc,
  vaultwbtcwftm,
  vaultwbtcweth,
} = vaults;

const [DEPOSIT_STABLE, DEPOSIT_FTM, DEPOSIT_WETH, DEPOSIT_WBTC] = [400, 400, 0.1, 0.0075];

const [BORROW_STABLE, BORROW_FTM, BORROW_WETH, BORROW_WBTC] = [
  DEPOSIT_STABLE / 2,
  DEPOSIT_FTM / 2,
  DEPOSIT_WETH / 2,
  DEPOSIT_WBTC / 2,
];

describe("Fantom Fuji Instance", function () {
  let f;

  let users;
  let user1;

  let evmSnapshot0;
  let evmSnapshot1;
  let evmSnapshot2;

  before(async function () {
    this.users = await ethers.getSigners();
    this.user1 = this.users[1];

    const loadFixture = createFixtureLoader(this.users, provider);
    this.f = await loadFixture(fixture);
    evmSnapshot0 = await evmSnapshot();

    for (let x = 0; x < 4; x += 1) {
      await this.f.ftmWrapper.connect(this.users[x]).deposit({ value: parseUnits(500) });

      const block = await provider.getBlock();
      await this.f.swapper
        .connect(this.users[x])
        .swapETHForExactTokens(
          parseUnits(DEPOSIT_STABLE),
          [ASSETS.WFTM.address, ASSETS.DAI.address],
          this.users[x].address,
          block.timestamp + 60,
          { value: parseUnits(500) }
        );
      await this.f.swapper
        .connect(this.users[x])
        .swapETHForExactTokens(
          parseUnits(DEPOSIT_STABLE, 6),
          [ASSETS.WFTM.address, ASSETS.USDC.address],
          this.users[x].address,
          block.timestamp + 60,
          { value: parseUnits(500) }
        );
      await this.f.swapper
        .connect(this.users[x])
        .swapETHForExactTokens(
          parseUnits(DEPOSIT_WETH),
          [ASSETS.WFTM.address, ASSETS.WETH.address],
          this.users[x].address,
          block.timestamp + 60,
          { value: parseUnits(500) }
        );
      await this.f.swapper
        .connect(this.users[x])
        .swapETHForExactTokens(
          parseUnits(DEPOSIT_WBTC, 8),
          [ASSETS.WFTM.address, ASSETS.WBTC.address],
          this.users[x].address,
          block.timestamp + 60,
          { value: parseUnits(500) }
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

  describe("Cream as Provider", function () {
    before(async function () {
      // evmRevert(evmSnapshot1);
      for (let i = 0; i < VAULTS.length; i += 1) {
        const vault = VAULTS[i];
        await this.f[vault.name].setProviders([this.f.ftmcream.address]);
        await this.f[vault.name].setActiveProvider(this.f.ftmcream.address);
      }
    });

    //   describe("Native token as collateral, ERC20 as borrow asset.", function () {
    //     testDeposit1(
    //       ftmAddrs.ftmcreamMapper,
    //       [vaultftmdai, vaultftmusdc, vaultftmweth, vaultftmwbtc],
    //       DEPOSIT_FTM
    //     );

    //     testBorrow1([vaultftmdai, vaultftmusdc], DEPOSIT_FTM, BORROW_STABLE);
    //     testBorrow1([vaultftmweth], DEPOSIT_FTM, BORROW_WETH);
    //     testBorrow1([vaultftmwbtc], DEPOSIT_FTM, BORROW_WBTC);

    //     testPaybackAndWithdraw1([vaultftmdai, vaultftmusdc], DEPOSIT_FTM, BORROW_STABLE);
    //     testPaybackAndWithdraw1([vaultftmweth], DEPOSIT_FTM, BORROW_WETH);
    //     testPaybackAndWithdraw1([vaultftmwbtc], DEPOSIT_FTM, BORROW_WBTC);
    //   });

    //   describe("ERC20 token as collateral, ERC20 as borrow asset.", function () {
    //     testDeposit2(
    //       ftmAddrs.ftmcreamMapper,
    //       [vaultwftmdai, vaultwftmusdc, vaultwftmweth, vaultwftmwbtc],
    //       DEPOSIT_FTM
    //     );
    //     testDeposit2(ftmAddrs.ftmcreamMapper, [vaultdaiwftm, vaultusdcwftm], DEPOSIT_STABLE);
    //     testDeposit2(
    //       ftmAddrs.ftmcreamMapper,
    //       [vaultwethwftm, vaultwethdai, vaultwethusdc, vaultwethwbtc],
    //       DEPOSIT_WETH
    //     );
    //     testDeposit2(
    //       ftmAddrs.ftmcreamMapper,
    //       [vaultwbtcwftm, vaultwbtcdai, vaultwbtcusdc, vaultwbtcweth],
    //       DEPOSIT_WBTC
    //     );

    //     testBorrow2([vaultwethdai, vaultwethusdc], DEPOSIT_WETH, BORROW_STABLE);
    //     testBorrow2([vaultwbtcdai, vaultwbtcusdc], DEPOSIT_WBTC, BORROW_STABLE);
    //     testBorrow2([vaultdaiwftm, vaultusdcwftm], DEPOSIT_STABLE, BORROW_FTM);
    //     testBorrow2([vaultdaiweth, vaultusdcweth], DEPOSIT_STABLE, BORROW_WETH);
    //     testBorrow2([vaultdaiwbtc, vaultusdcwbtc], DEPOSIT_STABLE, BORROW_WBTC);

    //     testPaybackAndWithdraw2([vaultdaiweth, vaultusdcweth], DEPOSIT_STABLE, BORROW_WETH);
    //     testPaybackAndWithdraw2([vaultdaiwbtc, vaultusdcwbtc], DEPOSIT_STABLE, BORROW_WBTC);
    //   });

    //   describe("ERC20 token as collateral, native token as borrow asset.", function () {
    //     testBorrow3([vaultdaiftm], DEPOSIT_STABLE, BORROW_FTM);

    //     testPaybackAndWithdraw3([vaultwbtcftm], DEPOSIT_WBTC, BORROW_FTM * 0.5);
    //     testPaybackAndWithdraw3([vaultwethftm], DEPOSIT_WETH, BORROW_FTM * 0.5);
    //     testPaybackAndWithdraw3([vaultdaiftm, vaultusdcftm], DEPOSIT_STABLE, BORROW_FTM * 0.5);
    //   });

    // testRefinance1(
    //   [vaultwethdai, vaultwethusdc],
    //   "ftmcream",
    //   "scream",
    //   DEPOSIT_WETH,
    //   BORROW_STABLE,
    //   0
    // );
    // testRefinance2([vaultusdcdai], "fuse3", "fuse18", 1);
    // testRefinance3([vaultdaieth], "fuse3", "fuse18", 1);
  });

  describe("Scream! as Provider", function () {
    before(async function () {
      // // REVERT to 2
      // evmRevert(evmSnapshot2);

      for (let i = 0; i < VAULTS.length; i += 1) {
        const vault = VAULTS[i];
        await this.f[vault.name].setProviders([this.f.scream.address]);
        await this.f[vault.name].setActiveProvider(this.f.scream.address);
      }
    });

    //   describe("Native token as collateral, ERC20 as borrow asset.", function () {
    //     testDeposit1(
    //       ftmAddrs.ftmcreamMapper,
    //       [vaultftmdai, vaultftmusdc, vaultftmweth, vaultftmwbtc],
    //       DEPOSIT_FTM
    //     );

    //     testBorrow1([vaultftmdai, vaultftmusdc], DEPOSIT_FTM, BORROW_STABLE);
    //     testBorrow1([vaultftmweth], DEPOSIT_FTM, BORROW_WETH);
    //     testBorrow1([vaultftmwbtc], DEPOSIT_FTM, BORROW_WBTC);

    //     testPaybackAndWithdraw1([vaultftmdai, vaultftmusdc], DEPOSIT_FTM, BORROW_STABLE);
    //     testPaybackAndWithdraw1([vaultftmweth], DEPOSIT_FTM, BORROW_WETH);
    //     testPaybackAndWithdraw1([vaultftmwbtc], DEPOSIT_FTM, BORROW_WBTC);
    //   });

    //   describe("ERC20 token as collateral, ERC20 as borrow asset.", function () {
    //     testDeposit2(
    //       ftmAddrs.ftmcreamMapper,
    //       [vaultwftmdai, vaultwftmusdc, vaultwftmweth, vaultwftmwbtc],
    //       DEPOSIT_FTM
    //     );
    //     testDeposit2(ftmAddrs.ftmcreamMapper, [vaultdaiwftm, vaultusdcwftm], DEPOSIT_STABLE);
    //     testDeposit2(
    //       ftmAddrs.ftmcreamMapper,
    //       [vaultwethwftm, vaultwethdai, vaultwethusdc, vaultwethwbtc],
    //       DEPOSIT_WETH
    //     );
    //     testDeposit2(
    //       ftmAddrs.ftmcreamMapper,
    //       [vaultwbtcwftm, vaultwbtcdai, vaultwbtcusdc, vaultwbtcweth],
    //       DEPOSIT_WBTC
    //     );

    //     testBorrow2([vaultwethdai, vaultwethusdc], DEPOSIT_WETH, BORROW_STABLE);
    //     testBorrow2([vaultwbtcdai, vaultwbtcusdc], DEPOSIT_WBTC, BORROW_STABLE);
    //     testBorrow2([vaultdaiwftm, vaultusdcwftm], DEPOSIT_STABLE, BORROW_FTM);
    //     testBorrow2([vaultdaiweth, vaultusdcweth], DEPOSIT_STABLE, BORROW_WETH);
    //     testBorrow2([vaultdaiwbtc, vaultusdcwbtc], DEPOSIT_STABLE, BORROW_WBTC);

    //     testPaybackAndWithdraw2([vaultdaiweth, vaultusdcweth], DEPOSIT_STABLE, BORROW_WETH);
    //     testPaybackAndWithdraw2([vaultdaiwbtc, vaultusdcwbtc], DEPOSIT_STABLE, BORROW_WBTC);
    //   });

    //   describe("ERC20 token as collateral, native token as borrow asset.", function () {
    //     testBorrow3([vaultdaiftm], DEPOSIT_STABLE, BORROW_FTM);

    //     testPaybackAndWithdraw3([vaultwbtcftm], DEPOSIT_WBTC, BORROW_FTM * 0.5);
    //     testPaybackAndWithdraw3([vaultwethftm], DEPOSIT_WETH, BORROW_FTM * 0.5);
    //     testPaybackAndWithdraw3([vaultdaiftm, vaultusdcftm], DEPOSIT_STABLE, BORROW_FTM * 0.5);
    //   });

    testRefinance1(
      [vaultwethdai, vaultwethusdc],
      "scream",
      "ftmcream",
      DEPOSIT_WETH,
      BORROW_STABLE,
      0
    );
    //   // testRefinance2([vaultusdcdai], "fuse3", "fuse18", 1);
    //   // testRefinance3([vaultdaieth], "fuse3", "fuse18", 1);
  });
});
