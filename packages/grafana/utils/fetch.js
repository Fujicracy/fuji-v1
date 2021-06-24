require("dotenv").config();
const { ethers } = require("ethers");
const { ETHUSDC, ETHDAI } = require("./addresses");
const { queryEvents } = require("./helpers");

const getEvents = async (provider, fromLast) => {
  const allEvents = await queryEvents(provider, fromLast);

  console.log(allEvents.length);

  const daiData = [];
  const ethDaiSupply = [];
  const usdcData = [];
  const ethUsdcSupply = [];
  let currentEthDaiSupply = 0;
  let currentEthUsdcSupply = 0;
  let currentDaiDebt = 0;
  let currentUsdcDebt = 0;
  let tx = null;
  let currentType = null;
  for (let i = 0; i <= allEvents.length - 1; i++) {
    console.log(i);
    const event = allEvents[i].event;
    if (allEvents[i].address === ETHDAI) {
      tx = allEvents[i].transactionHash;
      if (event === "Payback") {
        currentType = "DD";
        currentDaiDebt -= parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
        );
      } else if (event === "Borrow") {
        currentType = "DD";
        currentDaiDebt += parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
        );
      } else if (event === "Deposit") {
        currentType = "DS";
        currentEthDaiSupply += parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
        );
      } else if (event === "Withdraw") {
        currentType = "DS";
        currentEthDaiSupply -= parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
        );
      }
    }

    if (allEvents[i].address === ETHUSDC) {
      tx = allEvents[i].transactionHash;
      if (event === "Payback") {
        currentType = "UD";
        currentUsdcDebt -= parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 6)
        );
      } else if (event === "Borrow") {
        currentType = "UD";
        currentUsdcDebt += parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 6)
        );
      } else if (event === "Deposit") {
        currentType = "US";
        currentEthUsdcSupply += parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
        );
      } else if (event === "Withdraw") {
        currentType = "US";
        currentEthUsdcSupply -= parseFloat(
          ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
        );
      }
    }

    const timestamp = (await provider.getBlock(allEvents[i].blockNumber))
      .timestamp;
    const blocknumber = allEvents[i].blockNumber;

    const daiPoint = {
      vault: "ETHDAI",
      type: "DEBT",
      value: currentDaiDebt,
      blocknumber,
      timestamp,
      tx: currentType === "DD" ? tx : null,
    };

    const daiEthPoint = {
      vault: "ETHDAI",
      type: "COLL",
      value: currentEthDaiSupply,
      blocknumber,
      timestamp,
      tx: currentType === "DS" ? tx : null,
    };

    const usdcPoint = {
      vault: "ETHUSDC",
      type: "DEBT",
      value: currentUsdcDebt,
      blocknumber,
      timestamp,
      tx: currentType === "UD" ? tx : null,
    };

    const usdcEthPoint = {
      vault: "ETHUSDC",
      type: "COLL",
      value: currentEthUsdcSupply,
      blocknumber,
      timestamp,
      tx: currentType === "US" ? tx : null,
    };

    tx = null;
    currentType = null;
    daiData.push(daiPoint);

    ethDaiSupply.push(daiEthPoint);

    usdcData.push(usdcPoint);

    ethUsdcSupply.push(usdcEthPoint);
  }

  // console.log(usdcData[usdcData.length - 1]);

  // console.log(daiData[daiData.length - 1]);

  // console.log(ethDaiSupply[ethDaiSupply.length - 1]);

  // console.log(ethUsdcSupply[ethUsdcSupply.length - 1]);

  return [...daiData, ...ethDaiSupply, ...usdcData, ...ethUsdcSupply].sort(
    (a, b) => a.blockNumber - b.blockNumber
  );
};

module.exports = {
  getEvents,
};
