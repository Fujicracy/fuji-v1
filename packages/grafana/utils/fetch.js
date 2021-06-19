require("dotenv").config();
const axios = require("axios");
const { ethers } = require("ethers");
const VaultETHDAIAbi = require("../abis/VaultETHDAI.abi");
const VaultETHUSDCAbi = require("../abis/VaultETHUSDC.abi");
const {
  ETHUSDC,
  ETHDAI,
  UniswapAnchoredView,
  ETHDAICreateTX,
} = require("./addresses");
const UniswapAnchoredViewABI = require("../abis/UniswapAnchoredView.json");

const {
  //   organizeReturn,
  contractDeployBlock,
  findBiggestDiff,
  searchEvents,
  createDataPoint,
  //   blocksPer,
} = require("./helpers");

const Compound = {
  getAccount: async (blockNumber) => {
    let res;
    try {
      res = await axios.get("https://api.compound.finance/api/v2/account", {
        params: {
          addresses: [ETHUSDC, ETHDAI],
          block_number: blockNumber,
        },
      });
    } catch (err) {
      console.log(err);
    }
    return res;
  },
  getETHPrice: async (provider) => {
    let res;
    try {
      ctrct = new ethers.Contract(
        UniswapAnchoredView,
        UniswapAnchoredViewABI.abi.result,
        provider
      );
      res = (await ctrct.price("ETH")).toString();
      res = ethers.utils.formatUnits(res, "mwei");
    } catch (err) {
      console.log(err);
    }
    return res;
  },
};

// const compound = async (provider) => {
//   const [daiDeployData, usdcDeployData, currentBlock] =
//     await contractDeployBlock(provider);
//   const daiStart = daiDeployData.startBlock;
//   const usdcStart = usdcDeployData.startBlock;
//   const blockArray = [daiStart, usdcStart];
//   const oldestIndex = findBiggestDiff(blockArray, currentBlock);

//   const ETHPrice = await Compound.getETHPrice(provider);
//   //   console.log(blockArray[oldestIndex]);
//   // console.log(currentBlock);
//   const data = [];
//   const res = (await Compound.getAccount(currentBlock)).data;
//   console.log(res.accounts[0]);
//   console.log(res.accounts[1]);
//   //   for (
//   //     let i = blockArray[oldestIndex];
//   //     i < currentBlock;
//   //     i += blocksPer("day")
//   //   ) {
//   //     console.log(i);
//   //     console.log(currentBlock);

//   //     const ts = (await provider.getBlock(i)).timestamp;
//   //     //   console.log(res);
//   //     if (res.accounts.length > 0) {
//   //       const point = { dai: {}, usdc: {} };
//   //       res.accounts.forEach((acc) => {
//   //         const [collat, debt] = organizeReturn(acc.tokens);
//   //         //   console.log(debt);
//   //         point.timestamp = ts;
//   //         if (debt.symbol === "cDAI") {
//   //           point.dai.debt = parseFloat(debt.borrow_balance_underlying.value);
//   //           point.dai.collat =
//   //             parseFloat(acc.total_collateral_value_in_eth.value) *
//   //             parseFloat(ETHPrice);
//   //         } else {
//   //           point.usdc.debt = parseFloat(debt.borrow_balance_underlying.value);
//   //           point.usdc.collat =
//   //             parseFloat(acc.total_collateral_value_in_eth.value) *
//   //             parseFloat(ETHPrice);
//   //         }
//   //       });
//   //       data.push(point);
//   //     }
//   //   }

//   //   console.log(res);
//   //   return data;/
// };

const getEvents = async (provider) => {
  const [daiDeployData, usdcDeployData, currentBlock] =
    await contractDeployBlock(provider);
  const daiVault = new ethers.Contract(ETHDAI, VaultETHDAIAbi, provider);
  const usdcVault = new ethers.Contract(ETHUSDC, VaultETHUSDCAbi, provider);

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
  const arr = [
    daiBorrowEvents[0].blockNumber,
    daiPaybackEvents[0].blockNumber,
    usdcBorrowEvents[0].blockNumber,
    usdcPaybackEvents[0].blockNumber,
  ];
  const oldestIndex = findBiggestDiff(arr, currentBlock);
  //   console.log(arr[oldestIndex]);
  const eventMap = {
    dbEvents: daiBorrowEvents,
    dpEvents: daiPaybackEvents,
    ubEvents: usdcBorrowEvents,
    upEvents: usdcPaybackEvents,
  };

  let allEvents = [
    ...daiBorrowEvents.map((e) => e.blockNumber),
    ...daiPaybackEvents.map((e) => e.blockNumber),
    ...usdcBorrowEvents.map((e) => e.blockNumber),
    ...usdcPaybackEvents.map((e) => e.blockNumber),
  ].sort((a, b) => a - b);

  let num = 0;

  console.log(daiBorrowEvents.map((e) => e.blockNumber));
  //   console.log(daiBorrowEvents.length);
  //   console.log(daiPaybackEvents.length);
  //   console.log(usdcPaybackEvents.length);
  //   console.log(usdcBorrowEvents.length);
  //   console.log(allEvents.length);
  daiBorrowEvents.forEach((e) => {
    num += parseFloat(ethers.utils.formatUnits(e.args.amount.toString(), 18));
  });

  console.log(num);

  //   allEvents = [...new Set(allEvents)];

  //   console.log(allEvents);
  const daiData = [];
  const usdcData = [];
  let currentDaiDebt = 0;
  let currentUsdcDebt = 0;
  let lastDaiPoint = { debt: 0, timestamp: 0, blockNumber: 0 };
  let lastUsdcPoint = { debt: 0, timestamp: 0, blockNumber: 0 };
  for (let i = 0; i <= allEvents.length - 1; i++) {
    // console.log(i);
    // console.log(currentBlock);
    const daiAvailableEvents = searchEvents(
      [eventMap.dbEvents, eventMap.dpEvents],
      allEvents[i]
    );

    const daiDebt = createDataPoint(
      daiAvailableEvents,
      currentDaiDebt,
      lastDaiPoint
    );

    const daiPoint = {
      debt: daiDebt ? daiDebt : lastDaiPoint.debt,
    };

    currentDaiDebt = daiPoint.debt;
    if (daiAvailableEvents.length > 0) {
      daiPoint.timestamp = (await provider.getBlock(allEvents[i])).timestamp;
    } else {
      daiPoint.timestamp = lastDaiPoint.timestamp + 13 * 1000;
    }
    daiPoint.blockNumber = allEvents[i];
    daiData.push(daiPoint);
    lastDaiPoint = daiPoint;

    const usdcAvailableEvents = searchEvents(
      [eventMap.ubEvents, eventMap.upEvents],
      allEvents[i]
    );

    const usdcDebt = createDataPoint(
      usdcAvailableEvents,
      currentUsdcDebt,
      lastUsdcPoint,
      "USDC"
    );

    const usdcPoint = {
      debt: usdcDebt ? usdcDebt : lastUsdcPoint.debt,
    };

    // console.log(allEvents[i]);
    currentUsdcDebt = usdcPoint.debt;
    if (usdcAvailableEvents.length > 0) {
      usdcPoint.timestamp = (await provider.getBlock(allEvents[i])).timestamp;
    } else {
      usdcPoint.timestamp = lastUsdcPoint.timestamp + 13 * 1000;
    }
    // console.log("after", usdcPoint.timestamp);
    usdcPoint.blockNumber = allEvents[i];
    usdcData.push(usdcPoint);
    lastUsdcPoint = usdcPoint;
  }

  console.log(usdcData[usdcData.length - 1]);

  console.log(daiData[daiData.length - 1]);
};

let provider;

if (process.env.PROJECT_ID) {
  provider = new ethers.providers.InfuraProvider(
    "homestead",
    process.env.PROJECT_ID
  );
}

// console.log(provider);

console.log("USDC", ETHUSDC);
console.log("DAI", ETHDAI);
getEvents(provider);

compound(provider);
