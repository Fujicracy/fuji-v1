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

const organizeReturn = (arr) => {
  const [f, s] = arr;

  if (f.symbol === "cETH") {
    return [f, s];
  } else {
    return [s, f];
  }
};

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

const findBiggestDiff = (nums, minuend) => {
  let diff = 0;
  let oldestIndex = 0;
  nums.forEach((n, i) => {
    temp = minuend - n;
    if (temp > diff) {
      diff = temp;
      oldestIndex = i;
    }
  });

  return oldestIndex;
};

const findSmallestDiff = (nums, minuend) => {
  let diff = 0;
  let oldestIndex = 0;
  nums.forEach((n, i) => {
    temp = minuend - n;
    if (temp < diff) {
      diff = temp;
      oldestIndex = i;
    }
  });

  return oldestIndex;
};

const searchEvents = (arr, currentBlock) => {
  const [e1, e2] = arr;
  const lenList = [e1.length, e2.length];
  const largestList = findSmallestDiff(lenList, currentBlock);
  const events = [];
  for (let i = 0; i <= arr[largestList].length; i++) {
    if (e1[i] && e1[i].blockNumber === currentBlock) {
      events.push(e1[i]);
    }

    if (e2[i] && e2[i].blockNumber === currentBlock) {
      events.push(e2[i]);
    }
  }

  return events;
};

const createDataPoint = (arr, currentDebt, lastDaiPoint, type) => {
  if (arr.length < 1) {
    return lastDaiPoint.debt;
  }

  let tempDebt = currentDebt;

  arr.forEach((e) => {
    if (e.event === "Payback") {
      tempDebt -= parseFloat(
        ethers.utils.formatUnits(
          e.args.amount.toString(),
          type === "USDC" ? 6 : 18
        )
      );
    }

    if (e.event === "Borrow") {
      tempDebt += parseFloat(
        ethers.utils.formatUnits(
          e.args.amount.toString(),
          type === "USDC" ? 6 : 18
        )
      );
    }
  });

  return tempDebt;
};

const blocksPer = (key) => {
  const timeMap = {
    min: 4.5,
    hour: 277,
    day: 6646,
  };
  return timeMap[key];
};

module.exports = {
  organizeReturn,
  contractDeployBlock,
  findBiggestDiff,
  blocksPer,
  searchEvents,
  createDataPoint,
};
