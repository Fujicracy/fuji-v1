const { ethers } = require("hardhat");
const { expect } = require("chai");
const { formatUnitsToNum, parseUnits, timeTravel } = require("./helpers");
const { provider } = ethers;

function testFlashClose1(vaults, amountToDeposit, amountToBorrow, flashLoanProvider) {
  for (let i = 0; i < vaults.length; i += 1) {
    const { name, collateral, debt } = vaults[i];
    it(`flashClose ${amountToBorrow} ${debt.nameUp} after depositing ${amountToDeposit} ETH as collateral`, async function () {
      const depositAmount = parseUnits(amountToDeposit);
      const borrowAmount = parseUnits(amountToBorrow, debt.decimals);
      const { collateralID, borrowID } = await this.f[name].vAssets();
      // boostrap vault
      await this.f[name].connect(this.owner).deposit(depositAmount, { value: depositAmount });

      await this.f[name]
        .connect(this.user1)
        .depositAndBorrow(depositAmount, borrowAmount, { value: depositAmount });

      await expect(await this.f.f1155.balanceOf(this.user1.address, collateralID)).to.be.gte(
        depositAmount
      );
      await expect(await this.f.f1155.balanceOf(this.user1.address, borrowID)).to.be.gte(
        borrowAmount
      );

      const userBalBefore = await provider.getBalance(this.user1.address);

      await this.f.fliquidator.connect(this.user1).flashClose(-1, this.f[name].address, flashLoanProvider);

      const userBalAfter = await provider.getBalance(this.user1.address);

      await expect(await this.f.f1155.balanceOf(this.user1.address, collateralID)).to.be.equal(0);
      await expect(await this.f.f1155.balanceOf(this.user1.address, borrowID)).to.be.equal(0);
      expect(userBalAfter).to.be.gt(userBalBefore);
    });
  }
}

function testFlashClose2(vaults, amountToDeposit, amountToBorrow, flashLoanProvider) {
  for (let i = 0; i < vaults.length; i += 1) {
    const { name, collateral, debt } = vaults[i];
    it(`flashClose ${amountToBorrow} ${debt.nameUp} after depositing ${amountToDeposit} ${collateral.nameUp} as collateral`, async function () {
      const depositAmount = parseUnits(amountToDeposit, collateral.decimals);
      const borrowAmount = parseUnits(amountToBorrow, debt.decimals);
      const negborrowAmount = parseUnits(-amountToBorrow, debt.decimals);
      const { collateralID, borrowID } = await this.f[name].vAssets();
      // boostrap vault
      await this.f[collateral.name]
        .connect(this.owner)
        .approve(this.f[name].address, depositAmount);
      await this.f[name].connect(this.owner).deposit(depositAmount);

      await this.f[collateral.name]
        .connect(this.user1)
        .approve(this.f[name].address, depositAmount);
      await this.f[name].connect(this.user1).depositAndBorrow(depositAmount, borrowAmount);

      await expect(await this.f.f1155.balanceOf(this.user1.address, collateralID)).to.be.gte(
        depositAmount
      );
      await expect(await this.f.f1155.balanceOf(this.user1.address, borrowID)).to.be.gte(
        borrowAmount
      );

      const userBalBefore = await this.f[collateral.name].balanceOf(this.user1.address);

      await this.f.fliquidator.connect(this.user1).flashClose(-1, this.f[name].address, flashLoanProvider);

      const userBalAfter = await this.f[collateral.name].balanceOf(this.user1.address);

      await expect(await this.f.f1155.balanceOf(this.user1.address, collateralID)).to.be.equal(0);
      await expect(await this.f.f1155.balanceOf(this.user1.address, borrowID)).to.be.equal(0);
      expect(userBalAfter).to.be.gt(userBalBefore);
    });
  }
}

function testFlashClose3(vaults, amountToDeposit, amountToBorrow, flashLoanProvider) {
  for (let i = 0; i < vaults.length; i += 1) {
    const { name, collateral, debt } = vaults[i];
    it(`flashClose ${amountToBorrow} ${debt.nameUp} after depositing ${amountToDeposit} ${collateral.nameUp} as collateral`, async function () {
      const depositAmount = parseUnits(amountToDeposit, collateral.decimals);
      const borrowAmount = parseUnits(amountToBorrow);
      const negborrowAmount = parseUnits(-amountToBorrow);
      const { collateralID, borrowID } = await this.f[name].vAssets();
      // boostrap vault
      await this.f[collateral.name]
        .connect(this.owner)
        .approve(this.f[name].address, depositAmount);
      await this.f[name].connect(this.owner).deposit(depositAmount);

      await this.f[collateral.name]
        .connect(this.user1)
        .approve(this.f[name].address, depositAmount);
      await this.f[name].connect(this.user1).depositAndBorrow(depositAmount, borrowAmount);

      await expect(await this.f.f1155.balanceOf(this.user1.address, collateralID)).to.be.gte(
        depositAmount
      );
      await expect(await this.f.f1155.balanceOf(this.user1.address, borrowID)).to.be.gte(
        borrowAmount
      );

      const userBalBefore = await this.f[collateral.name].balanceOf(this.user1.address);

      await this.f.fliquidator.connect(this.user1).flashClose(-1, this.f[name].address, flashLoanProvider);

      const userBalAfter = await this.f[collateral.name].balanceOf(this.user1.address);

      await expect(await this.f.f1155.balanceOf(this.user1.address, collateralID)).to.be.equal(0);
      await expect(await this.f.f1155.balanceOf(this.user1.address, borrowID)).to.be.equal(0);
      expect(userBalAfter).to.be.gt(userBalBefore);
    });
  }
}

function testBatchLiquidate1(vaults, providerName, amountToBorrow) {
    describe(`batchLiquidate with ${providerName} as provider` , async function () {
      for (let j = 0; j < vaults.length; j++) {
        const vault = vaults[j];
        it(`Test: function batchLiquidate() carelessUsers, in ${vault.name}`, async function () {
          // Set ActiveProvider
          await this.f[vault.name].connect(this.owner).setActiveProvider(this.f[providerName].address);

          // Gen. definitions, including corresponding amounts to deposit and borrow
          const vAssets = await this.f[vault.name].vAssets();
          const asset = this.f[vault.debt.name];
          const borrowAmount = parseUnits(amountToBorrow, vault.debt.decimals);
          const depositAmount = await this.f[vault.name].getNeededCollateralFor(
            borrowAmount.mul(ethers.BigNumber.from(1025)).div(ethers.BigNumber.from(1000)), true
          );

          // Perform boostrap, then deposit and borrow for all users to be liquidated
          // Conditional to check for nativetoken Vault or not
          for (var k = 0; k < this.carelessUsers.length; k++) {
            if(vault.collateral.name == this.nativeToken) {
              await this.f[vault.name].connect(this.owner).deposit(depositAmount, {value: depositAmount});
              await this.f[vault.name].connect(this.carelessUsers[k]).depositAndBorrow(
                depositAmount, borrowAmount, { value: depositAmount }
              );
            } else {
              await this.f[vault.name].connect(this.owner).deposit(depositAmount);
              await this.f[vault.name].connect(this.carelessUsers[k]).depositAndBorrow(
                depositAmount, borrowAmount
              );
            }
          }

          // Change LTV from 75% to ~60% (including 5% safety factor)
          await this.f[vault.name].setFactor(1587,1000,"collatF");

          // Record Balance of Liquidator prior to liquidations, and approve ERC20 if required
            // Conditional to check for nativetoken Vault or not
          if(vault.collateral.name == this.nativeToken) {
            const liqBalAtStart = await this.liquidatorUser.getBalance();
          } else {
            const liqBalAtStart = await asset.balanceOf(this.liquidatorUser.address);
            await asset
              .connect(this.liquidatorUser)
              .approve(this.f.fliquidator.address, liqBalAtStart);
          }

          // liquidate!
          await this.f.fliquidator.connect(this.liquidatorUser).batchLiquidate(
            [this.carelessUsers],
            this.f[vault.name].address
          );

          // Record Balance of Liquidator after liquidations,
            // Conditional to check for nativetoken Vault or not
          if(vault.collateral.name == this.nativeToken) {
            const liqBalAtEnd = await this.liquidatorUser.getBalance();
          } else {
            const liqBalAtEnd = await asset.balanceOf(this.liquidatorUser.address);
          }

          // Test Checks
          await expect(liqBalAtEnd).to.be.gt(liqBalAtStart);

          for (var k = 0; k < this.carelessUsers.length; k++) {
            const carelessUser1155debtbal = await f1155.balanceOf(
              this.carelessUsers[k].address,
              vAssets.borrowID
            );
            await expect(carelessUser1155debtbal).to.be.eq(0);
          }
      });
    }
  });
}


module.exports = {
  testFlashClose1,
  testFlashClose2,
  testFlashClose3,
  testBatchLiquidate1
};
