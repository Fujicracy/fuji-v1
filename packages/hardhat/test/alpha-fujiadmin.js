const { ethers } = require("hardhat");
const { expect } = require("chai");
const { createFixtureLoader } = require("ethereum-waffle");

const { fixture, evmSnapshot, evmRevert, TREASURY_ADDR, ZERO_ADDR } = require("./utils-alpha");

// use(solidity);

describe("Alpha", () => {
  let fujiadmin;
  let fliquidator;
  let flasher;
  let controller;
  let compound;
  let vaultdai;
  let vaultusdc;

  let users;
  let owner;
  let newOwner;
  let user;

  let loadFixture;
  let evmSnapshotId;

  before(async () => {
    users = await ethers.getSigners();
    loadFixture = createFixtureLoader(users, ethers.provider);
    owner = users[0];
    newOwner = users[1];
    user = users[2];
    evmSnapshotId = await evmSnapshot();
  });

  after(async () => {
    evmRevert(evmSnapshotId);
  });

  beforeEach(async () => {
    const theFixture = await loadFixture(fixture);
    fujiadmin = theFixture.fujiadmin;
    fliquidator = theFixture.fliquidator;
    flasher = theFixture.flasher;
    controller = theFixture.controller;
    compound = theFixture.compound;
    vaultdai = theFixture.vaultdai;
    vaultusdc = theFixture.vaultusdc;

    await vaultdai.setActiveProvider(compound.address);
    await vaultusdc.setActiveProvider(compound.address);
  });

  describe("Alpha FujiAdmin Basic Functionality", () => {
    it("Testing the FujiAdmin", async () => {
      await expect(await fujiadmin.getFlasher()).to.equal(flasher.address);
      await expect(await fujiadmin.getFliquidator()).to.equal(fliquidator.address);
      await expect(await fujiadmin.getController()).to.equal(controller.address);
      await expect(await fujiadmin.getTreasury()).to.equal(TREASURY_ADDR);
    });

    describe("Testing ownership transfer", () => {
      it("Revert: User tricks to have ownership of the contract", async () => {
        await expect(fujiadmin.connect(user).transferOwnership(user.address)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("Revert: Owner tries to transfer ownership to zero-address", async () => {
        await expect(fujiadmin.connect(owner).transferOwnership(ZERO_ADDR)).to.be.reverted;
      });

      it("Success: Owner tries to transfer ownership to new Owner", async () => {
        expect(await fujiadmin.pendingOwner()).to.be.equal(ZERO_ADDR);

        await fujiadmin.connect(owner).transferOwnership(newOwner.address);

        expect(await fujiadmin.pendingOwner()).to.be.equal(newOwner.address);
      });

      it("Revert: User tries to claim ownership", async () => {
        await expect(fujiadmin.connect(user).claimOwnership()).to.be.reverted;
      });

      it("Success: New owner tries to claim ownership", async () => {
        expect(await fujiadmin.pendingOwner()).to.be.equal(newOwner.address);
        expect(await fujiadmin.owner()).to.be.equal(owner.address);

        await fujiadmin.connect(newOwner).claimOwnership();

        expect(await fujiadmin.pendingOwner()).to.be.equal(ZERO_ADDR);
        expect(await fujiadmin.owner()).to.be.equal(newOwner.address);
      });

      it("Revert: Owner tries to call cancelTransferOwnership", async () => {
        await expect(fujiadmin.connect(owner).cancelTransferOwnership()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("Revert: New owner tries to call cancelTransferOwnership before calling transferOwnership", async () => {
        await expect(fujiadmin.connect(newOwner).cancelTransferOwnership()).to.be.reverted;
      });

      it("Success: New owner tries to call cancelTransferOwnership after calling transferOwnership", async () => {
        expect(await fujiadmin.pendingOwner()).to.be.equal(ZERO_ADDR);

        await fujiadmin.connect(newOwner).transferOwnership(owner.address);

        expect(await fujiadmin.pendingOwner()).to.be.equal(owner.address);

        await fujiadmin.connect(newOwner).cancelTransferOwnership();

        expect(await fujiadmin.pendingOwner()).to.be.equal(ZERO_ADDR);
      });
    });
  });
});
