const { ethers } = require("ethers");

const ABI = require("../consts/vault.abi");
const { VAULTS_ADDRESS, VAULTS } = require("../consts/vaults");
const { ASSETS } = require("../consts/assets");

const queryEvents = async (provider, fromLast) => {
  const events = [];

  for (const addr of Object.values(VAULTS_ADDRESS)) {
    const vault = new ethers.Contract(addr, ABI, provider);

    const eventDeposit = await vault.filters.Deposit();
    const deposits = await vault.queryFilter(
      eventDeposit,
      fromLast ?? VAULTS[addr].deployBlockNumber,
    );
    events.push(...deposits);

    const eventWithdraw = await vault.filters.Withdraw();
    const withdraws = await vault.queryFilter(
      eventWithdraw,
      fromLast ?? VAULTS[addr].deployBlockNumber,
    );
    events.push(...withdraws);

    const eventBorrow = await vault.filters.Borrow();
    const borrows = await vault.queryFilter(
      eventBorrow,
      fromLast ?? VAULTS[addr].deployBlockNumber,
    );
    events.push(...borrows);

    const eventPayback = await vault.filters.Payback();
    const paybacks = await vault.queryFilter(
      eventPayback,
      fromLast ?? VAULTS[addr].deployBlockNumber,
    );
    events.push(...paybacks);
  }

  return events.sort((a, b) => a.blockNumber - b.blockNumber);
}

const getEvents = async (provider, fromLast) => {
  const events = await queryEvents(provider, fromLast);

  const eventsData = [];

  for (let i = 0; i < events.length; i += 1) {
    const { event, args, address, transactionHash, blockNumber } = events[i];

    const vault = VAULTS[address.toLowerCase()];
    const decimals = event === "Deposit" || event === "Withdraw"
      ? ASSETS[vault.collateralAsset.name].decimals
      : ASSETS[vault.borrowAsset.name].decimals;

    const amount = parseFloat(
      ethers.utils.formatUnits(args.amount.toString(), decimals)
    );

    const block = await provider.getBlock(blockNumber);

    eventsData.push({
      eventName: event,
      user: args.userAddrs,
      vaultName: vault.name,
      market: vault.market,
      amount,
      blockNumber,
      timestamp: block.timestamp,
    });
  }

  return eventsData;
};

module.exports = { getEvents };
