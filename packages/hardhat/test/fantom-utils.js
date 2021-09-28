const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

const { getContractAt, getContractFactory } = ethers;

const { formatUnitsOfCurrency, parseUnits, toBN, timeTravel, ZERO_ADDR } = require("./utils-alpha");

const SPOOKY_ROUTER_ADDR = "0xF491e7B69E4244ad4002BC14e878a34207E38c29";
const TREASURY_ADDR = "0xb98d4D4e205afF4d4755E9Df19BD0B8BD4e0f148"; // Deployer

const DEBUG = false;

const ASSETS = {
  FTM: {
    name: "ftm",
    nameUp: "FTM",
    address: "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF", // fantom
    oracle: "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc",
    decimals: 18,
  },
  DAI: {
    name: "dai",
    nameUp: "DAI",
    address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E", // fantom
    oracle: "0x91d5DEFAFfE2854C7D02F50c80FA1fdc8A721e52",
    decimals: 18,
  },
  USDC: {
    name: "usdc",
    nameUp: "USDC",
    address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", // fantom
    oracle: "0x2553f4eeb82d5A26427b8d1106C51499CBa5D99c",
    decimals: 6,
  },
  WFTM: {
    name: "wftm",
    nameUp: "WFTM",
    address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83", // fantom
    oracle: "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc",
    decimals: 18,
  },
  WETH: {
    name: "weth",
    nameUp: "WETH",
    address: "0x74b23882a30290451A17c44f4F05243b6b58C76d", // fantom
    oracle: "0x11DdD3d147E5b83D01cee7070027092397d63658",
    decimals: 18,
  },
  WBTC: {
    name: "wbtc",
    nameUp: "WBTC",
    address: "0x321162Cd933E2Be498Cd2267a90534A804051b11", // fantom
    oracle: "0x8e94C22142F4A64b99022ccDd994f4e9EC86E4B4",
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
  const swapper = await getContractAt("IUniswapV2Router02", SPOOKY_ROUTER_ADDR);
  const ftmWrapper = await getContractAt(
    "contracts/interfaces/IWETH.sol:IWETH",
    ASSETS.WFTM.address
  );

  // Step 1: Base Contracts
  const FujiAdmin = await getContractFactory("FujiAdmin");
  const fujiadmin = await upgrades.deployProxy(FujiAdmin, []);

  const Fliquidator = await getContractFactory("Fliquidator");
  const fliquidator = await Fliquidator.deploy([]);

  const Flasher = await getContractFactory("Flasher");
  const flasher = await Flasher.deploy([]);

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
  const ProviderFTMCream = await getContractFactory("ProviderFTMCream");
  const ftmcream = await ProviderFTMCream.deploy([]);
  const ProviderScream = await getContractFactory("ProviderScream");
  const scream = await ProviderFTMCream.deploy([]);

  // Log if debug is set true
  if (DEBUG) {
    console.log("fujiadmin", fujiadmin.address);
    console.log("fliquidator", fliquidator.address);
    console.log("flasher", flasher.address);
    console.log("controller", controller.address);
    console.log("f1155", f1155.address);
    console.log("oracle", oracle.address);
    console.log("ftmcream", ftmcream.address);
    console.log("scream", scream.address);
  }

  // Setp 3: Vaults
  const FujiVaultFTM = await getContractFactory("FujiVaultFTM");
  // deploy a vault for each entry in ASSETS
  const vaults = {};
  for (const { name, collateral, debt } of getVaults()) {
    const vault = await upgrades.deployProxy(FujiVaultFTM, [
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

    vaults[name] = vault;
  }

  // Step 4: Setup
  await fujiadmin.setFlasher(flasher.address);
  await fujiadmin.setFliquidator(fliquidator.address);
  await fujiadmin.setTreasury(TREASURY_ADDR);
  await fujiadmin.setController(controller.address);
  await fliquidator.setFujiAdmin(fujiadmin.address);
  await fliquidator.setSwapper(SPOOKY_ROUTER_ADDR);
  await flasher.setFujiAdmin(fujiadmin.address);
  await controller.setFujiAdmin(fujiadmin.address);
  await f1155.setPermit(fliquidator.address, true);

  return {
    ...tokens,
    ...vaults,
    ftmcream,
    scream,
    oracle,
    fujiadmin,
    fliquidator,
    flasher,
    controller,
    f1155,
    swapper,
    ftmWrapper,
  };
};

function testDeposit1(mapperAddr, vaults, amount) {
  for (let i = 0; i < vaults.length; i += 1) {
    const vault = vaults[i];
    it(`deposit ${amount} FTM as collateral, check ${vault.name} balance`, async function () {
      const fujimapper = await getContractAt("FujiMapping", mapperAddr);
      const vAssets = await this.f[vault.name].vAssets();
      const cTokenAddr = await fujimapper.addressMapping(vAssets.collateralAsset);
      const cETH = await getContractAt("ICEth", cTokenAddr);

      const depositAmount = parseUnits(amount);
      const negdepositAmount = parseUnits(-amount);

      await expect(
        await this.f[vault.name]
          .connect(this.user1)
          .deposit(depositAmount, { value: depositAmount })
      ).to.changeEtherBalance(this.user1, negdepositAmount);

      let vaultBal = await cETH.balanceOf(this.f[vault.name].address);
      vaultBal = await formatUnitsOfCurrency(cETH.address, vaultBal);

      const rate = await cETH.exchangeRateStored();

      let tokenAmount = depositAmount.mul(toBN(1e18)).div(rate);
      tokenAmount = await formatUnitsOfCurrency(cETH.address, tokenAmount);

      await expect(vaultBal).to.be.equal(tokenAmount);
    });
  }
}

function testDeposit2(mapperAddr, vaults, amount) {
  for (let i = 0; i < vaults.length; i += 1) {
    const vault = vaults[i];
    it(`deposit ${amount} ERC20 -> ${vault.collateral.nameUp} as collateral, check ${vault.name} balance`, async function () {
      const fujimapper = await getContractAt("FujiMapping", mapperAddr);
      const vAssets = await this.f[vault.name].vAssets();
      const cTokenAddr = await fujimapper.addressMapping(vAssets.collateralAsset);
      const cToken = await getContractAt("ICErc20", cTokenAddr);

      const depositAmount = parseUnits(amount, vault.collateral.decimals);
      const negdepositAmount = parseUnits(-amount, vault.collateral.decimals);

      await this.f[vault.collateral.name]
        .connect(this.user1)
        .approve(this.f[vault.name].address, depositAmount);
      await expect(() =>
        this.f[vault.name].connect(this.user1).deposit(depositAmount)
      ).to.changeTokenBalance(this.f[vault.collateral.name], this.user1, negdepositAmount);

      let vaultBal = await cToken.balanceOf(this.f[vault.name].address);
      vaultBal = await formatUnitsOfCurrency(cToken.address, vaultBal);

      const rate = await cToken.exchangeRateStored();

      let tokenAmount = depositAmount.mul(toBN(1e18)).div(rate);
      tokenAmount = await formatUnitsOfCurrency(cToken.address, tokenAmount);

      await expect(vaultBal).to.be.equal(tokenAmount);
    });
  }
}

function testBorrow1(vaults, amountToDeposit, amountToBorrow) {
  for (let i = 0; i < vaults.length; i += 1) {
    const { name, collateral, debt } = vaults[i];
    it(`borrow ${amountToBorrow} ERC20 -> ${debt.nameUp} after depositing ${amountToDeposit} FTM as collateral`, async function () {
      const depositAmount = parseUnits(amountToDeposit);
      const negdepositAmount = parseUnits(-amountToDeposit);
      const borrowAmount = parseUnits(amountToBorrow, debt.decimals);
      const { collateralID, borrowID } = await this.f[name].vAssets();

      await expect(
        await this.f[name].connect(this.user1).deposit(depositAmount, { value: depositAmount })
      ).to.changeEtherBalance(this.user1, negdepositAmount);
      await expect(await this.f.f1155.balanceOf(this.user1.address, collateralID)).to.be.equal(
        depositAmount
      );

      await expect(() =>
        this.f[name].connect(this.user1).borrow(borrowAmount)
      ).to.changeTokenBalance(this.f[debt.name], this.user1, borrowAmount);
      await expect(await this.f.f1155.balanceOf(this.user1.address, borrowID)).to.be.equal(
        borrowAmount
      );
    });
  }
}

function testBorrow2(vaults, amountToDeposit, amountToBorrow) {
  for (let i = 0; i < vaults.length; i += 1) {
    const { name, collateral, debt } = vaults[i];
    it(`borrow ${amountToBorrow} ERC20 -> ${debt.nameUp} after depositing ${amountToDeposit} ERC20 -> ${collateral.nameUp} as collateral`, async function () {
      const depositAmount = parseUnits(amountToDeposit, collateral.decimals);
      const negdepositAmount = parseUnits(-amountToDeposit, collateral.decimals);
      const borrowAmount = parseUnits(amountToBorrow, debt.decimals);
      const { collateralID, borrowID } = await this.f[name].vAssets();

      await this.f[collateral.name]
        .connect(this.user1)
        .approve(this.f[name].address, depositAmount);
      await expect(() =>
        this.f[name].connect(this.user1).deposit(depositAmount)
      ).to.changeTokenBalance(this.f[collateral.name], this.user1, negdepositAmount);
      await expect(await this.f.f1155.balanceOf(this.user1.address, collateralID)).to.be.equal(
        depositAmount
      );

      await expect(() =>
        this.f[name].connect(this.user1).borrow(borrowAmount)
      ).to.changeTokenBalance(this.f[debt.name], this.user1, borrowAmount);
      await expect(await this.f.f1155.balanceOf(this.user1.address, borrowID)).to.be.equal(
        borrowAmount
      );
    });
  }
}

function testBorrow3(vaults, amountToDeposit, amountToBorrow) {
  for (let i = 0; i < vaults.length; i += 1) {
    const { name, collateral, debt } = vaults[i];
    it(`borrow ${amountToBorrow} FTM after depositing ${amountToDeposit} ERC20 -> ${collateral.nameUp} as collateral`, async function () {
      const depositAmount = parseUnits(amountToDeposit, collateral.decimals);
      const negdepositAmount = parseUnits(-amountToDeposit, collateral.decimals);
      const borrowAmount = parseUnits(amountToBorrow);
      const { collateralID, borrowID } = await this.f[name].vAssets();

      await this.f[collateral.name]
        .connect(this.user1)
        .approve(this.f[name].address, depositAmount);
      await expect(() =>
        this.f[name].connect(this.user1).deposit(depositAmount)
      ).to.changeTokenBalance(this.f[collateral.name], this.user1, negdepositAmount);

      await expect(await this.f.f1155.balanceOf(this.user1.address, collateralID)).to.be.equal(
        depositAmount
      );

      await expect(
        await this.f[name].connect(this.user1).borrow(borrowAmount)
      ).to.changeEtherBalance(this.user1, borrowAmount);

      await expect(await this.f.f1155.balanceOf(this.user1.address, borrowID)).to.be.equal(
        borrowAmount
      );
    });
  }
}

function testPaybackAndWithdraw1(vaults, amountToDeposit, amountToBorrow) {
  for (let i = 0; i < vaults.length; i += 1) {
    const { name, collateral, debt } = vaults[i];
    it(`payback ${amountToBorrow} ERC20 -> ${debt.nameUp} and withdraw ${amountToDeposit} FTM`, async function () {
      const depositAmount = parseUnits(amountToDeposit);
      const borrowAmount = parseUnits(amountToBorrow, debt.decimals);
      const one = parseUnits(1, debt.decimals);
      const negborrowAmount = parseUnits(-amountToBorrow, debt.decimals);
      const { collateralID, borrowID } = await this.f[name].vAssets();
      // boostrap vault
      await this.f[name].connect(this.users[0]).deposit(depositAmount, { value: depositAmount });

      for (let x = 1; x < 4; x += 1) {
        await this.f[name]
          .connect(this.users[x])
          .depositAndBorrow(depositAmount, borrowAmount, { value: depositAmount });
        await timeTravel(60);
      }

      for (let x = 1; x < 4; x += 1) {
        await this.f[debt.name].connect(this.users[x]).approve(this.f[name].address, borrowAmount);
        await expect(() =>
          this.f[name].connect(this.users[x]).payback(borrowAmount)
        ).to.changeTokenBalance(this.f[debt.name], this.users[x], negborrowAmount);
        await expect(await this.f.f1155.balanceOf(this.users[x].address, borrowID)).to.be.lt(one);
      }

      for (let x = 1; x < 4; x += 1) {
        await this.f[name].connect(this.users[x]).withdraw(-1);
        await expect(await this.f.f1155.balanceOf(this.users[x].address, collateralID)).to.be.lt(
          1e13
        );
      }
    });
  }
}

function testPaybackAndWithdraw2(vaults, amountToDeposit, amountToBorrow) {
  for (let i = 0; i < vaults.length; i += 1) {
    const { name, collateral, debt } = vaults[i];
    it(`payback ${amountToBorrow} ERC20 -> ${debt.nameUp} and withdraw ${amountToDeposit} ERC20 -> ${collateral.nameUp}`, async function () {
      const depositAmount = parseUnits(amountToDeposit, collateral.decimals);
      const borrowAmount = parseUnits(amountToBorrow, debt.decimals);
      const negborrowAmount = parseUnits(-amountToBorrow, debt.decimals);
      const { collateralID, borrowID } = await this.f[name].vAssets();
      // boostrap vault
      await this.f[collateral.name]
        .connect(this.users[0])
        .approve(this.f[name].address, depositAmount);
      await this.f[name].connect(this.users[0]).deposit(depositAmount);

      for (let x = 1; x < 4; x += 1) {
        await this.f[collateral.name]
          .connect(this.users[x])
          .approve(this.f[name].address, depositAmount);
        await this.f[name].connect(this.users[x]).depositAndBorrow(depositAmount, borrowAmount);
      }

      const oneDebt = parseUnits(1, debt.decimals);
      for (let x = 1; x < 4; x += 1) {
        await this.f[debt.name].connect(this.users[x]).approve(this.f[name].address, borrowAmount);
        await expect(() =>
          this.f[name].connect(this.users[x]).payback(borrowAmount)
        ).to.changeTokenBalance(this.f[debt.name], this.users[x], negborrowAmount);
        await expect(await this.f.f1155.balanceOf(this.users[x].address, borrowID)).to.be.lt(
          oneDebt
        );
      }

      const oneCol = parseUnits(1, collateral.decimals);
      for (let x = 1; x < 4; x += 1) {
        await this.f[name].connect(this.users[x]).withdraw(-1);
        await expect(await this.f.f1155.balanceOf(this.users[x].address, collateralID)).to.be.lt(
          oneCol
        );
      }
    });
  }
}

function testPaybackAndWithdraw3(vaults, amountToDeposit, amountToBorrow) {
  for (let i = 0; i < vaults.length; i += 1) {
    const { name, collateral, debt } = vaults[i];
    it(`payback FTM and withdraw ERC20 -> ${collateral.nameUp}`, async function () {
      const depositAmount = parseUnits(amountToDeposit, collateral.decimals);
      const borrowAmount = parseUnits(amountToBorrow);
      const negborrowAmount = parseUnits(-amountToBorrow);
      const { collateralID, borrowID } = await this.f[name].vAssets();
      // boostrap vault
      await this.f[collateral.name]
        .connect(this.users[0])
        .approve(this.f[name].address, depositAmount);
      await this.f[name].connect(this.users[0]).deposit(depositAmount);

      for (let x = 1; x < 4; x += 1) {
        await this.f[collateral.name]
          .connect(this.users[x])
          .approve(this.f[name].address, depositAmount);
        await timeTravel(60);
        await this.f[name].connect(this.users[x]).depositAndBorrow(depositAmount, borrowAmount);
      }

      const fractionDebt = parseUnits(1, 16);
      for (let x = 1; x < 4; x += 1) {
        await expect(
          await this.f[name].connect(this.users[x]).payback(borrowAmount, { value: borrowAmount })
        ).to.changeEtherBalance(this.users[x], negborrowAmount);
        await expect(await this.f.f1155.balanceOf(this.users[x].address, borrowID)).to.be.lt(
          fractionDebt
        );
      }

      const oneCol = parseUnits(1, collateral.decimals);
      for (let x = 1; x < 4; x += 1) {
        await this.f[name].connect(this.users[x]).withdraw(-1);
        await expect(await this.f.f1155.balanceOf(this.users[x].address, collateralID)).to.be.lt(
          oneCol
        );
      }
    });
  }
}

/*
const testRefinance1 = (vaults, from, to, flashloanProvider = 1) => {
  for (let i = 0; i < vaults.length; i += 1) {
    const { name, collateral, debt } = vaults[i];
    it(`refinance ERC20 -> ${debt.nameUp} debt with ETH as collateral`, async () => {
      const depositAmount = parseUnits(3);
      const borrowAmount = parseUnits(BORROW_ERC20, debt.decimals);

      await f[name]
        .connect(users[1])
        .depositAndBorrow(depositAmount, borrowAmount, { value: depositAmount });

      let preVaultDebt = await f[name].borrowBalance(f[from].address);
      preVaultDebt = formatUnitsToNum(preVaultDebt, debt.decimals);

      let preVaultCollat = await f[name].depositBalance(f[from].address);
      preVaultCollat = formatUnitsToNum(preVaultCollat);

      await f.controller
        .connect(users[0])
        .doRefinancing(f[name].address, f[to].address, 1, 1, flashloanProvider);

      let postVaultDebt = await f[name].borrowBalance(f[to].address);
      postVaultDebt = formatUnitsToNum(postVaultDebt, debt.decimals);

      let postVaultCollat = await f[name].depositBalance(f[to].address);
      postVaultCollat = formatUnitsToNum(postVaultCollat);

      await expect(preVaultDebt).to.be.closeTo(postVaultDebt, 1.3);
      await expect(preVaultCollat).to.be.closeTo(postVaultCollat, 0.001);
    });
  }
}

const testRefinance2 = (vaults, from, to, flashloanProvider = 1) => {
  for (let i = 0; i < vaults.length; i += 1) {
    const { name, collateral, debt } = vaults[i];
    it(`refinance ERC20 -> ${debt.nameUp} debt with ERC20 -> ${collateral.nameUp} as collateral`, async () => {
      const depositAmount = parseUnits(DEPOSIT_ERC20, collateral.decimals);
      const borrowAmount = parseUnits(BORROW_ERC20, debt.decimals);

      await f[collateral.name].connect(users[1]).approve(f[name].address, depositAmount);
      await f[name].connect(users[1]).depositAndBorrow(depositAmount, borrowAmount);

      let preVaultDebt = await f[name].borrowBalance(f[from].address);
      preVaultDebt = formatUnitsToNum(preVaultDebt, debt.decimals);

      let preVaultCollat = await f[name].depositBalance(f[from].address);
      preVaultCollat = formatUnitsToNum(preVaultCollat, collateral.decimals);

      await f.controller
        .connect(users[0])
        .doRefinancing(f[name].address, f[to].address, 1, 1, flashloanProvider);

      let postVaultDebt = await f[name].borrowBalance(f[to].address);
      postVaultDebt = formatUnitsToNum(postVaultDebt, debt.decimals);

      let postVaultCollat = await f[name].depositBalance(f[to].address);
      postVaultCollat = formatUnitsToNum(postVaultCollat, collateral.decimals);

      await expect(preVaultDebt).to.be.closeTo(postVaultDebt, 1.3);
      await expect(preVaultCollat).to.be.closeTo(postVaultCollat, 1);
    });
  }
}

const testRefinance3 = (vaults, from, to, flashloanProvider = 1) => {
  for (let i = 0; i < vaults.length; i += 1) {
    const { name, collateral, debt } = vaults[i];
    it(`refinance ETH debt with ERC20 -> ${collateral.nameUp} as collateral`, async () => {
      const depositAmount = parseUnits(DEPOSIT_ERC20, collateral.decimals);
      const borrowAmount = parseUnits(BORROW_ETH);

      await f[collateral.name].connect(users[1]).approve(f[name].address, depositAmount);
      await f[name].connect(users[1]).depositAndBorrow(depositAmount, borrowAmount);

      let preVaultDebt = await f[name].borrowBalance(f[from].address);
      preVaultDebt = formatUnitsToNum(preVaultDebt);

      let preVaultCollat = await f[name].depositBalance(f[from].address);
      preVaultCollat = formatUnitsToNum(preVaultCollat, collateral.decimals);

      await f.controller
        .connect(users[0])
        .doRefinancing(f[name].address, f[to].address, 1, 1, flashloanProvider);

      let postVaultDebt = await f[name].borrowBalance(f[to].address);
      postVaultDebt = formatUnitsToNum(postVaultDebt);

      let postVaultCollat = await f[name].depositBalance(f[to].address);
      postVaultCollat = formatUnitsToNum(postVaultCollat, collateral.decimals);

      await expect(preVaultDebt).to.be.closeTo(postVaultDebt, 0.001);
      await expect(preVaultCollat).to.be.closeTo(postVaultCollat, 1);
    });
  }
}
*/

module.exports = {
  fixture,
  ASSETS,
  VAULTS: getVaults(),
  testDeposit1,
  testDeposit2,
  testBorrow1,
  testBorrow2,
  testBorrow3,
  testPaybackAndWithdraw1,
  testPaybackAndWithdraw2,
  testPaybackAndWithdraw3,
  /*
  testRefinance1,
  testRefinance2,
  testRefinance3,
  */
};
