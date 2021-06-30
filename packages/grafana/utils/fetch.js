require("dotenv").config();
const { ethers } = require("ethers");
const { ETHUSDC, ETHDAI } = require("./addresses");
const { queryEvents } = require("./helpers");

const isPresent = (obj, account) => {
  const accounts = Object.keys(obj);
  return accounts.includes(account);
};

const getEvents = async (provider, fromLast) => {
  const allEvents = await queryEvents(provider, fromLast);

  console.log(allEvents.length);

  const accounts = {};
  const account = { debt: 0, coll: 0 };
  const accountsData = [];
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
    // console.log(i);
    const e = allEvents[i];
    const event = e.event;
    const user = e.args.userAddrs;
    if (!accounts[user]) {
      console.log("not present", user);
      accounts[user] = {
        ETHDAI: { debt: 0, coll: 0 },
        ETHUSDC: { debt: 0, coll: 0 },
      };
    }
    if (allEvents[i].address === ETHDAI) {
      tx = allEvents[i].transactionHash;
      const num = parseFloat(
        ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
      );
      if (event === "Payback") {
        currentType = "DD";
        currentDaiDebt -= num;
        accounts[user].ETHDAI.debt -= num;
      } else if (event === "Borrow") {
        currentType = "DD";
        currentDaiDebt += num;
        accounts[user].ETHDAI.debt += num;
      } else if (event === "Deposit") {
        currentType = "DS";
        currentEthDaiSupply += num;
        accounts[user].ETHDAI.coll += num;
      } else if (event === "Withdraw") {
        currentType = "DS";
        currentEthDaiSupply -= num;
        accounts[user].ETHDAI.coll -= num;
      }
    }

    if (allEvents[i].address === ETHUSDC) {
      tx = allEvents[i].transactionHash;
      const usdcNum = parseFloat(
        ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 6)
      );
      const num = parseFloat(
        ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
      );
      if (event === "Payback") {
        currentType = "UD";
        currentUsdcDebt -= usdcNum;
        accounts[user].ETHUSDC.debt -= usdcNum;
      } else if (event === "Borrow") {
        currentType = "UD";
        currentUsdcDebt += usdcNum;
        accounts[user].ETHUSDC.debt += usdcNum;
      } else if (event === "Deposit") {
        currentType = "US";
        currentEthUsdcSupply += num;
        accounts[user].ETHUSDC.coll += num;
      } else if (event === "Withdraw") {
        currentType = "US";
        currentEthUsdcSupply -= num;
        accounts[user].ETHUSDC.coll -= num;
      }
    }

    const timestamp = (await provider.getBlock(allEvents[i].blockNumber))
      .timestamp;
    const blocknumber = allEvents[i].blockNumber;

    const accountsPoint = {
      accounts,
      blocknumber,
      timestamp,
    };

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

    accountsData.push(accountsPoint);
    // console.log(accounts);
  }

  // console.log(usdcData[usdcData.length - 1]);

  // console.log(daiData[daiData.length - 1]);

  // console.log(ethDaiSupply[ethDaiSupply.length - 1]);

  // console.log(ethUsdcSupply[ethUsdcSupply.length - 1]);
  const vaultData = [
    ...daiData,
    ...ethDaiSupply,
    ...usdcData,
    ...ethUsdcSupply,
  ].sort((a, b) => a.blockNumber - b.blockNumber);

  return [vaultData, accountsData, accounts];
};

module.exports = {
  getEvents,
};
