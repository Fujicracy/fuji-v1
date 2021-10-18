const { ethers } = require("hardhat");
const { expect } = require("chai");
const { provider } = ethers;
const {
  formatUnitsToNum,
  parseUnits,
  timeTravel,
  toBN,
  FLASHLOAN,
  flashLoanDecider
} = require("./helpers");

const { ASSETS } = require("./core-utils");

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

      await this.f.fliquidator
        .connect(this.user1)
        .flashClose(-1, this.f[name].address, flashLoanProvider);

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

      await this.f.fliquidator
        .connect(this.user1)
        .flashClose(-1, this.f[name].address, flashLoanProvider);

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

      await this.f.fliquidator
        .connect(this.user1)
        .flashClose(-1, this.f[name].address, flashLoanProvider);

      const userBalAfter = await this.f[collateral.name].balanceOf(this.user1.address);

      await expect(await this.f.f1155.balanceOf(this.user1.address, collateralID)).to.be.equal(0);
      await expect(await this.f.f1155.balanceOf(this.user1.address, borrowID)).to.be.equal(0);
      expect(userBalAfter).to.be.gt(userBalBefore);
    });
  }
}

const DEBUG = false;

function testBatchLiquidate1(vaults, providerName, amountToBorrow) {
    describe(`batchLiquidate with ${providerName} as provider` , async function () {
      for (let j = 0; j < vaults.length; j++) {
        const vault = vaults[j];
        it(`Test: function batchLiquidate() carelessUsers, in ${vault.name}`, async function () {
          // Set ActiveProvider
          await this.f[vault.name].connect(this.owner).setActiveProvider(this.f[providerName].address);

          // Gen. definitions, including corresponding amounts to deposit and borrow
          const block = await provider.getBlock();
          const vAssets = await this.f[vault.name].vAssets();
          const assetdebt = this.f[vault.debt.name];
          const borrowAmount = parseUnits(amountToBorrow, vault.debt.decimals);
          const depositAmount = await this.f[vault.name].getNeededCollateralFor(
            borrowAmount.mul(toBN(1025)).div(toBN(1000)), true
          );

          // Do bootstrap and load bootstrapper with ERC20 (when applicable)
          // Conditional check for when collateral is not nativetoken
          let assetcollat;
          if (vault.collateral.name != this.nativeToken) {
            assetcollat = this.f[vault.collateral.name];
            await this.f.swapper
              .connect(this.owner)
              .swapETHForExactTokens(
                depositAmount.mul(3),
                [ASSETS.WETH.address, vault.collateral.address],
                this.owner.address,
                block.timestamp + 60,
                { value: parseUnits(10) }
              );
            await assetcollat
              .connect(this.owner)
              .approve(this.f[vault.name].address, depositAmount);
            await this.f[vault.name].connect(this.owner).deposit(depositAmount);
          } else {
            await this.f[vault.name].connect(this.owner).deposit(depositAmount, {value: depositAmount});
          }
          if (DEBUG) {console.log("step1 complete")}

          //Deposit and borrow for all users to be liquidated
          // Conditional check for when collateral is not nativetoken
          for (let k = 0; k < this.carelessUsers.length; k++) {
            if(vault.collateral.name != this.nativeToken) {
              await assetcollat
                .connect(this.carelessUsers[k])
                .approve(this.f[vault.name].address, depositAmount);
              await this.f[vault.name].connect(this.carelessUsers[k]).depositAndBorrow(
                depositAmount, borrowAmount
              );
            } else {
              await this.f[vault.name].connect(this.carelessUsers[k]).depositAndBorrow(
                depositAmount, borrowAmount, { value: depositAmount }
              );
            }
          }
          if (DEBUG) {console.log("step2 complete")}


          // Change LTV from 75% to ~60% (including 5% safety factor)
          await this.f[vault.name].connect(this.owner).setFactor(1587,1000,"collatF");

          // Load Liquidator with debt Asset and record balance of Liquidator debtAsset prior to liquidations,
          // Conditional check for when debtAsset is not nativetoken
          let liqBalAtStart;
          if (vault.debt.name != this.nativeToken) {
            await this.f.swapper
              .connect(this.liquidatorUser)
              .swapETHForExactTokens(
                borrowAmount.mul(3),
                [ASSETS.WETH.address, vault.debt.address],
                this.liquidatorUser.address,
                block.timestamp + 60,
                { value: parseUnits(10) }
              );
            liqBalAtStart = await assetdebt.balanceOf(this.liquidatorUser.address);
            await assetdebt
              .connect(this.liquidatorUser)
              .approve(this.f.fliquidator.address, liqBalAtStart);
          } else {
            liqBalAtStart = await this.liquidatorUser.getBalance();
          }
          if (DEBUG) {console.log("step3 complete", "liqBalAtStart", liqBalAtStart/1)}


          // liquidate!
          // Conditional check for when debtAsset is not nativetoken
          const carelessUsersAddrs = this.carelessUsers.map( carelessUser => carelessUser.address);
          if (vault.debt.name != this.nativeToken) {
            await this.f.fliquidator.connect(this.liquidatorUser).batchLiquidate(
              carelessUsersAddrs,
              this.f[vault.name].address
            );
          } else {
            // Need to determine value to send when nativeToken
            let arrayOfDebtBalances = (await this.f.f1155
              .balanceOfBatch(
                carelessUsersAddrs,
                Array(carelessUsersAddrs.length).fill(vAssets.borrowID)
              ));
            let sumofDebtBalances = toBN(0);
            for (let k = 0; k < arrayOfDebtBalances.length; k++) {
              sumofDebtBalances = sumofDebtBalances.add(arrayOfDebtBalances[k]);
            }
            await this.f.fliquidator.connect(this.liquidatorUser).batchLiquidate(
              carelessUsersAddrs,
              this.f[vault.name].address,
              { value: sumofDebtBalances.mul(toBN(1001)).div(toBN(1000)) }
            );
          }
          if (DEBUG) {console.log("step4 complete") }

          // Test Checks

          // Record Balance of debtAsset of Liquidator after liquidations,
            // Conditional to check for nativetoken or not
          let liqBalAtEnd;
          if(vault.debt.name != this.nativeToken) {
            liqBalAtEnd = await assetdebt.balanceOf(this.liquidatorUser.address);
            await expect(liqBalAtEnd).to.be.gt(liqBalAtStart);
          } else {
            liqBalAtEnd = await this.liquidatorUser.getBalance();
            // need a way to verify nativeToken ROI for liquidator using nativetoken as debt asset.
          }

          for (var k = 0; k < this.carelessUsers.length; k++) {
            const carelessUser1155debtbal = await this.f.f1155.balanceOf(
              carelessUsersAddrs[k],
              vAssets.borrowID
            );
            await expect(carelessUser1155debtbal).to.be.eq(0);
          }
      });
    }
  });
}

function testBatchLiquidate2(vaults, providerName, amountToBorrow) {
    describe(`batchLiquidate with ${providerName} as provider` , async function () {
      for (let j = 0; j < vaults.length; j++) {
        const vault = vaults[j];
        it(`Test: function batchLiquidate() carelessUsers + nonLiquidatableUsers, in ${vault.name}`, async function () {
          // Set ActiveProvider
          await this.f[vault.name].connect(this.owner).setActiveProvider(this.f[providerName].address);

          // Gen. definitions, including corresponding amounts to deposit and borrow
          const block = await provider.getBlock();
          const vAssets = await this.f[vault.name].vAssets();
          const assetdebt = this.f[vault.debt.name];
          const borrowAmount = parseUnits(amountToBorrow, vault.debt.decimals);
          const depositAmount = await this.f[vault.name].getNeededCollateralFor(
            borrowAmount.mul(toBN(1025)).div(toBN(1000)), true
          );

          // Do bootstrap and load bootstrapper with ERC20 (when applicable)
          // Conditional check for when collateral is not nativetoken
          let assetcollat;
          if (vault.collateral.name != this.nativeToken) {
            assetcollat = this.f[vault.collateral.name];
            await this.f.swapper
              .connect(this.owner)
              .swapETHForExactTokens(
                depositAmount.mul(3),
                [ASSETS.WETH.address, vault.collateral.address],
                this.owner.address,
                block.timestamp + 60,
                { value: parseUnits(10) }
              );
            await assetcollat
              .connect(this.owner)
              .approve(this.f[vault.name].address, depositAmount);
            await this.f[vault.name].connect(this.owner).deposit(depositAmount);
          } else {
            await this.f[vault.name].connect(this.owner).deposit(depositAmount, {value: depositAmount});
          }
          if (DEBUG) {console.log("step1 complete")}

          //Deposit and borrow for all users to be liquidated
          // Conditional check for when collateral is not nativetoken
          for (let k = 0; k < this.carelessUsers.length; k++) {
            if(vault.collateral.name != this.nativeToken) {
              await assetcollat
                .connect(this.carelessUsers[k])
                .approve(this.f[vault.name].address, depositAmount);
              await this.f[vault.name].connect(this.carelessUsers[k]).depositAndBorrow(
                depositAmount, borrowAmount
              );
            } else {
              await this.f[vault.name].connect(this.carelessUsers[k]).depositAndBorrow(
                depositAmount, borrowAmount, { value: depositAmount }
              );
            }
          }

          //Deposit and borrow for all users that will Not be liquidateable
          // Conditional check for when collateral is not nativetoken
          const smallerBorrowAmount = borrowAmount.mul(5).div(100);
          for (let k = 0; k < this.goodUsers.length; k++) {
            if(vault.collateral.name != this.nativeToken) {
              await assetcollat
                .connect(this.goodUsers[k])
                .approve(this.f[vault.name].address, depositAmount);
              await this.f[vault.name].connect(this.goodUsers[k]).depositAndBorrow(
                depositAmount, smallerBorrowAmount
              );
            } else {
              await this.f[vault.name].connect(this.goodUsers[k]).depositAndBorrow(
                depositAmount, smallerBorrowAmount, { value: depositAmount }
              );
            }
          }
          if (DEBUG) {console.log("step2 complete", `Good user borrowAmount ${borrowAmount.mul(5).div(100)}`)}


          // Change LTV from 75% to ~60% (including 5% safety factor)
          await this.f[vault.name].connect(this.owner).setFactor(1587,1000,"collatF");

          // Load Liquidator with debt Asset and record balance of Liquidator debtAsset prior to liquidations,
          // Conditional check for when debtAsset is not nativetoken
          let liqBalAtStart;
          if (vault.debt.name != this.nativeToken) {
            await this.f.swapper
              .connect(this.liquidatorUser)
              .swapETHForExactTokens(
                borrowAmount.mul(5),
                [ASSETS.WETH.address, vault.debt.address],
                this.liquidatorUser.address,
                block.timestamp + 60,
                { value: parseUnits(10) }
              );
            liqBalAtStart = await assetdebt.balanceOf(this.liquidatorUser.address);
            await assetdebt
              .connect(this.liquidatorUser)
              .approve(this.f.fliquidator.address, liqBalAtStart);
          } else {
            liqBalAtStart = await this.liquidatorUser.getBalance();
          }
          if (DEBUG) {console.log("step3 complete", "liqBalAtStart", liqBalAtStart/1)}


          // liquidate!
          // Conditional check for when debtAsset is not nativetoken

          const carelessUsersAddrs = this.carelessUsers.map( carelessUser => carelessUser.address);
          const goodUsersAddrs = this.goodUsers.map( goodUser => goodUser.address);
          const allAddresses = carelessUsersAddrs.concat(goodUsersAddrs);

          if (vault.debt.name != this.nativeToken) {
            await this.f.fliquidator.connect(this.liquidatorUser).batchLiquidate(
              allAddresses,
              this.f[vault.name].address
            );
          } else {
            // Need to determine value to send when nativeToken
            let arrayOfDebtBalances = (await this.f.f1155
              .balanceOfBatch(
                allAddresses,
                Array(allAddresses.length).fill(vAssets.borrowID)
              ));
            console.log(arrayOfDebtBalances);
            let sumofDebtBalances = toBN(0);
            for (let k = 0; k < arrayOfDebtBalances.length; k++) {
              sumofDebtBalances = sumofDebtBalances.add(arrayOfDebtBalances[k]);
            }
            await this.f.fliquidator.connect(this.liquidatorUser).batchLiquidate(
              allAddresses,
              this.f[vault.name].address,
              { value: sumofDebtBalances.mul(toBN(1001)).div(toBN(1000)) }
            );
          }
          if (DEBUG) {console.log("step4 complete") }

          // Test Checks

          // Record Balance of debtAsset of Liquidator after liquidations,
            // Conditional to check for nativetoken or not
          let liqBalAtEnd;
          if(vault.debt.name != this.nativeToken) {
            liqBalAtEnd = await assetdebt.balanceOf(this.liquidatorUser.address);
            await expect(liqBalAtEnd).to.be.gt(liqBalAtStart);
          } else {
            liqBalAtEnd = await this.liquidatorUser.getBalance();
            // need a way to verify nativeToken ROI for liquidator using nativetoken as debt asset.
          }

          for (var k = 0; k < this.carelessUsers.length; k++) {
            const carelessUser1155debtbal = await this.f.f1155.balanceOf(
              carelessUsersAddrs[k],
              vAssets.borrowID
            );
            await expect(carelessUser1155debtbal).to.be.eq(0);
          }

          for (var k = 0; k < this.goodUsers.length; k++) {
            const goodUser1155debtbal = await this.f.f1155.balanceOf(
              goodUsersAddrs[k],
              vAssets.borrowID
            );
            await expect(goodUser1155debtbal).to.be.gt(0);
          }
      });
    }
  });
}

function testflashBatchLiquidate1(vaults, providerName, amountToBorrow) {
    describe(`flashBatchLiquidate with ${providerName} as provider` , async function () {
      for (let j = 0; j < vaults.length; j++) {
        const vault = vaults[j];
        it(`Test: function flashBatchLiquidate() carelessUsers + nonLiquidatableUsers, in ${vault.name}`, async function () {
          // Set ActiveProvider
          await this.f[vault.name].connect(this.owner).setActiveProvider(this.f[providerName].address);

          // Gen. definitions, including corresponding amounts to deposit and borrow
          const block = await provider.getBlock();
          const vAssets = await this.f[vault.name].vAssets();
          const assetdebt = this.f[vault.debt.name];
          const borrowAmount = parseUnits(amountToBorrow, vault.debt.decimals);
          const depositAmount = await this.f[vault.name].getNeededCollateralFor(
            borrowAmount.mul(toBN(1025)).div(toBN(1000)), true
          );

          // Do bootstrap and load bootstrapper with ERC20 (when applicable)
          // Conditional check for when collateral is not nativetoken
          let assetcollat;
          if (vault.collateral.name != this.nativeToken) {
            assetcollat = this.f[vault.collateral.name];
            await this.f.swapper
              .connect(this.owner)
              .swapETHForExactTokens(
                depositAmount.mul(3),
                [ASSETS.WETH.address, vault.collateral.address],
                this.owner.address,
                block.timestamp + 60,
                { value: parseUnits(10) }
              );
            await assetcollat
              .connect(this.owner)
              .approve(this.f[vault.name].address, depositAmount);
            await this.f[vault.name].connect(this.owner).deposit(depositAmount);
          } else {
            await this.f[vault.name].connect(this.owner).deposit(depositAmount, {value: depositAmount});
          }
          if (DEBUG) {console.log("step1 complete")}

          //Deposit and borrow for all users to be liquidated
          // Conditional check for when collateral is not nativetoken
          for (let k = 0; k < this.carelessUsers.length; k++) {
            if(vault.collateral.name != this.nativeToken) {
              await assetcollat
                .connect(this.carelessUsers[k])
                .approve(this.f[vault.name].address, depositAmount);
              await this.f[vault.name].connect(this.carelessUsers[k]).depositAndBorrow(
                depositAmount, borrowAmount
              );
            } else {
              await this.f[vault.name].connect(this.carelessUsers[k]).depositAndBorrow(
                depositAmount, borrowAmount, { value: depositAmount }
              );
            }
          }

          //Deposit and borrow for all users that will Not be liquidateable
          // Conditional check for when collateral is not nativetoken
          const smallerBorrowAmount = borrowAmount.mul(5).div(100);
          for (let k = 0; k < this.goodUsers.length; k++) {
            if(vault.collateral.name != this.nativeToken) {
              await assetcollat
                .connect(this.goodUsers[k])
                .approve(this.f[vault.name].address, depositAmount);
              await this.f[vault.name].connect(this.goodUsers[k]).depositAndBorrow(
                depositAmount, smallerBorrowAmount
              );
            } else {
              await this.f[vault.name].connect(this.goodUsers[k]).depositAndBorrow(
                depositAmount, smallerBorrowAmount, { value: depositAmount }
              );
            }
          }
          if (DEBUG) {console.log("step2 complete", `Good user borrowAmount ${borrowAmount.mul(5).div(100)}`)}


          // Change LTV from 75% to ~60% (including 5% safety factor)
          await this.f[vault.name].connect(this.owner).setFactor(1587,1000,"collatF");

          // Record balance of Liquidator debtAsset prior to liquidations,
          // Conditional check for when debtAsset is not nativetoken
          let liqBalAtStart;
          if (vault.debt.name != this.nativeToken) {
            liqBalAtStart = await assetdebt.balanceOf(this.liquidatorUser.address);
          } else {
            liqBalAtStart = await this.liquidatorUser.getBalance();
          }
          if (DEBUG) {console.log("step3 complete", "liqBalAtStart", liqBalAtStart/1)}


          // liquidate!
          // Conditional check for when debtAsset is not nativetoken
          const carelessUsersAddrs = this.carelessUsers.map( carelessUser => carelessUser.address);
          const goodUsersAddrs = this.goodUsers.map( goodUser => goodUser.address);
          const allAddresses = carelessUsersAddrs.concat(goodUsersAddrs);

          await this.f.fliquidator.connect(this.liquidatorUser).flashBatchLiquidate(
            allAddresses,
            this.f[vault.name].address,
            flashLoanDecider(providerName, vault.debt.name)
          );
          if (DEBUG) {console.log("step4 complete") }

          // Test Checks

          // Record Balance of debtAsset of Liquidator after liquidations,
            // Conditional to check for nativetoken or not
          let liqBalAtEnd;
          if(vault.debt.name != this.nativeToken) {
            liqBalAtEnd = await assetdebt.balanceOf(this.liquidatorUser.address);
            await expect(liqBalAtEnd).to.be.gt(liqBalAtStart);
          } else {
            liqBalAtEnd = await this.liquidatorUser.getBalance();
            // need a way to verify nativeToken ROI for liquidator using nativetoken as debt asset.
          }

          for (var k = 0; k < this.carelessUsers.length; k++) {
            const carelessUser1155debtbal = await this.f.f1155.balanceOf(
              carelessUsersAddrs[k],
              vAssets.borrowID
            );
            await expect(carelessUser1155debtbal).to.be.eq(0);
          }

          for (var k = 0; k < this.goodUsers.length; k++) {
            const goodUser1155debtbal = await this.f.f1155.balanceOf(
              goodUsersAddrs[k],
              vAssets.borrowID
            );
            await expect(goodUser1155debtbal).to.be.gt(0);
          }
      });
    }
  });
}


module.exports = {
  testFlashClose1,
  testFlashClose2,
  testFlashClose3,
  testBatchLiquidate1,
  testBatchLiquidate2,
  testflashBatchLiquidate1
};
