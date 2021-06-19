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

const searchEvents = (arr, currentBlock) => {
  const [e1, e2] = arr;

  const largestList = findBiggestDiff([e1.length, e2.length], currentBlock);
  events = [];
  for (let i = 0; i <= arr[largestList].length; i++) {
    if (e1[i].blockNumber === currentBlock) {
      events.push(e1[i]);
    }

    if (e2[i].blockNumber === currentBlock) {
      events.push(e2[i]);
    }

    if (e2[i].blockNumber > currentBlock && e1[i].blockNumber > currentBlock) {
      break;
    }
  }

  return events;
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
};

// let provider;

// if (process.env.PROJECT_ID) {
//   provider = new ethers.providers.InfuraProvider(
//     "homestead",
//     process.env.PROJECT_ID
//   );
// }

// contractDeployBlock(provider);
