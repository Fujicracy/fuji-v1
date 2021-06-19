require("dotenv").config();
const { ethers } = require("ethers");
const { ETHUSDC, ETHDAI } = require("./addresses");
const { queryEvents } = require("./helpers");

const getEvents = async (provider) => {
  const allEvents = await queryEvents(provider);

  const daiData = [];
  const ethDaiSupply = [];
  const usdcData = [];
  const ethUsdcSupply = [];
  let currentEthDaiSupply = 0;
  let currentEthUsdcSupply = 0;
  let currentDaiDebt = 0;
  let currentUsdcDebt = 0;
  for (let i = 0; i <= allEvents.length - 1; i++) {
    if (allEvents[i].address === ETHDAI) {
      if (allEvents[i].event === "Payback") {
        currentDaiDebt -= parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
        );
      } else if (allEvents[i].event === "Borrow") {
        currentDaiDebt += parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
        );
      } else if (allEvents[i].event === "Deposit") {
        currentEthDaiSupply += parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
        );
      } else if (allEvents[i].event === "Withdraw") {
        currentEthDaiSupply -= parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
        );
      }
    }

    if (allEvents[i].address === ETHUSDC) {
      if (allEvents[i].event === "Payback") {
        currentUsdcDebt -= parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 6)
        );
      } else if (allEvents[i].event === "Borrow") {
        currentUsdcDebt += parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 6)
        );
      } else if (allEvents[i].event === "Deposit") {
        currentEthUsdcSupply += parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
        );
      } else if (allEvents[i].event === "Withdraw") {
        currentEthUsdcSupply -= parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
        );
      }
    }

    const timestamp = (await provider.getBlock(allEvents[i].blockNumber))
      .timestamp;
    const daiPoint = {
      debt: currentDaiDebt,
      blockNumber: allEvents[i].blockNumber,
      timestamp,
    };

    const daiEthPoint = {
      supply: currentEthDaiSupply,
      blockNumber: allEvents[i].blockNumber,
      timestamp,
    };

    const usdcPoint = {
      debt: currentUsdcDebt,
      blockNumber: allEvents[i].blockNumber,
      timestamp,
    };

    const usdcEthPoint = {
      supply: currentEthUsdcSupply,
      blockNumber: allEvents[i].blockNumber,
      timestamp,
    };

    daiData.push(daiPoint);

    ethDaiSupply.push(daiEthPoint);

    usdcData.push(usdcPoint);

    ethUsdcSupply.push(usdcEthPoint);
  }

  console.log(usdcData[usdcData.length - 1]);

  console.log(daiData[daiData.length - 1]);

  console.log(ethDaiSupply[ethDaiSupply.length - 1]);

  console.log(ethUsdcSupply[ethUsdcSupply.length - 1]);

  return {
    daiDebt: daiData,
    daiCollat: ethDaiSupply,
    usdcDebt: usdcData,
    usdcCollat: ethUsdcSupply,
  };
};

module.exports = {
  getEvents,
};
