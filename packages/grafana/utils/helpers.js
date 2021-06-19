require("dotenv").config();
const {
  ETHUSDC,
  ETHDAI,
  ETHDAICreateTX,
  ETHUSDCCreateTX,
} = require("./addresses");
const { ethers } = require("ethers");
const ETHDAIABI = require("../abis/VaultETHDAI.abi");
const ETHUSDCABI = require("../abis/VaultETHUSDC.abi");
const axios = require("axios");

const contractDeployBlock = async (provider) => {
  const daiStartBlock = (await provider.getTransaction(ETHDAICreateTX))
    .blockNumber;
  const usdcStartBlock = (await provider.getTransaction(ETHUSDCCreateTX))
    .blockNumber;

  const daiTimeStamp = (await provider.getBlock(daiStartBlock)).timestamp;
  const usdcTimeStamp = (await provider.getBlock(usdcStartBlock)).timestamp;

  const daiInfo = {
    startBlock: daiStartBlock,
    timestamp: daiTimeStamp,
  };

  const usdcInfo = {
    startBlock: usdcStartBlock,
    timestamp: usdcTimeStamp,
  };

  const currentBlock = await provider.getBlockNumber();

  return [daiInfo, usdcInfo, currentBlock];
};

const queryEvents = async (provider) => {
  const [daiDeployData, usdcDeployData, currentBlock] =
    await contractDeployBlock(provider);
  const daiVault = new ethers.Contract(ETHDAI, ETHDAIABI, provider);
  const usdcVault = new ethers.Contract(ETHUSDC, ETHUSDCABI, provider);

  const evtDaiBorrow = await daiVault.filters.Borrow();

  const daiBorrowEvents = await daiVault.queryFilter(
    evtDaiBorrow,
    daiDeployData.startBlock
  );

  const evtDaiPayback = await daiVault.filters.Payback();

  const daiPaybackEvents = await daiVault.queryFilter(
    evtDaiPayback,
    daiDeployData.startBlock
  );

  const evtEthDaiSupply = await daiVault.filters.Deposit();

  const ethDaiSupplyEvents = await daiVault.queryFilter(
    evtEthDaiSupply,
    daiDeployData.startBlock
  );

  const evtEthDaiWithdraw = await daiVault.filters.Withdraw();

  const ethDaiWithdrawEvents = await daiVault.queryFilter(
    evtEthDaiWithdraw,
    daiDeployData.startBlock
  );

  const evtUsdcBorrow = await usdcVault.filters.Borrow();

  const usdcBorrowEvents = await usdcVault.queryFilter(
    evtUsdcBorrow,
    usdcDeployData.startBlock
  );

  const evtUsdcPayback = await usdcVault.filters.Payback();

  const usdcPaybackEvents = await usdcVault.queryFilter(
    evtUsdcPayback,
    usdcDeployData.startBlock
  );

  const evtEthusdcSupply = await usdcVault.filters.Deposit();

  const ethusdcSupplyEvents = await usdcVault.queryFilter(
    evtEthusdcSupply,
    usdcDeployData.startBlock
  );

  const evtEthusdcWithdraw = await usdcVault.filters.Withdraw();

  const ethusdcWithdrawEvents = await usdcVault.queryFilter(
    evtEthusdcWithdraw,
    usdcDeployData.startBlock
  );

  // console.log(ethusdcWithdrawEvents.length);
  // console.log(ethusdcWithdrawEvents[0].args.amount.toString());
  // console.log(ethusdcSupplyEvents[0]);
  // console.log(ethusdcSupplyEvents[0].args.amount.toString());
  // console.log(ethDaiWithdrawEvents.length);
  console.log(ethDaiSupplyEvents.length);
  return [
    ...ethDaiWithdrawEvents,
    ...ethDaiSupplyEvents,
    ...daiBorrowEvents,
    ...daiPaybackEvents,
    ...ethusdcWithdrawEvents,
    ...ethusdcSupplyEvents,
    ...usdcBorrowEvents,
    ...usdcPaybackEvents,
  ];
};

module.exports = {
  queryEvents,
  contractDeployBlock,
};
