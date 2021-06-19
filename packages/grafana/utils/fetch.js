require("dotenv").config();
// const axios = require("axios");
const { ethers } = require("ethers");
const VaultETHDAIAbi = require("../abis/VaultETHDAI.abi");
const VaultETHUSDCAbi = require("../abis/VaultETHUSDC.abi");
const {
  ETHUSDC,
  ETHDAI,
  UniswapAnchoredView,
  ETHDAICreateTX,
} = require("./addresses");
// const UniswapAnchoredViewABI = require("../abis/UniswapAnchoredView.json");

const {
  //   organizeReturn,
  contractDeployBlock,
  findBiggestDiff,
  searchEvents,
  //   blocksPer,
} = require("./helpers");

// const Compound = {
//   getAccount: async (blockNumber) => {
//     let res;
//     try {
//       res = await axios.get("https://api.compound.finance/api/v2/account", {
//         params: {
//           addresses: [ETHUSDC, ETHDAI],
//           block_number: blockNumber,
//         },
//       });
//     } catch (err) {
//       console.log(err);
//     }
//     return res;
//   },
//   getETHPrice: async (provider) => {
//     let res;
//     try {
//       ctrct = new ethers.Contract(
//         UniswapAnchoredView,
//         UniswapAnchoredViewABI.abi.result,
//         provider
//       );
//       res = (await ctrct.price("ETH")).toString();
//       res = ethers.utils.formatUnits(res, "mwei");
//     } catch (err) {
//       console.log(err);
//     }
//     return res;
//   },
// };

// const Borrow = {
//   aave: async () => {},

//   dydx: async () => {},

//   compound: async (provider) => {
//     const [daiDeployData, usdcDeployData, currentBlock] =
//       await contractDeployBlock(provider);
//     const daiStart = daiDeployData.startBlock;
//     const usdcStart = usdcDeployData.startBlock;
//     const blockArray = [daiStart, usdcStart];
//     const oldestIndex = findBiggestDiff(blockArray, currentBlock);

//     const ETHPrice = await Compound.getETHPrice(provider);
//     // console.log(blockArray[oldestIndex]);
//     // console.log(currentBlock);
//     const data = [];
//     for (
//       let i = blockArray[oldestIndex];
//       i < currentBlock;
//       i += blocksPer("day")
//     ) {
//       const res = (await Compound.getAccount(i)).data;
//       console.log(i);
//       console.log(currentBlock);

//       const ts = (await provider.getBlock(i)).timestamp;
//       //   console.log(res);
//       if (res.accounts.length > 0) {
//         const point = { dai: {}, usdc: {} };
//         res.accounts.forEach((acc) => {
//           const [collat, debt] = organizeReturn(acc.tokens);
//           //   console.log(debt);
//           point.timestamp = ts;
//           if (debt.symbol === "cDAI") {
//             point.dai.debt = parseFloat(debt.borrow_balance_underlying.value);
//             point.dai.collat =
//               parseFloat(acc.total_collateral_value_in_eth.value) *
//               parseFloat(ETHPrice);
//           } else {
//             point.usdc.debt = parseFloat(debt.borrow_balance_underlying.value);
//             point.usdc.collat =
//               parseFloat(acc.total_collateral_value_in_eth.value) *
//               parseFloat(ETHPrice);
//           }
//         });
//         data.push(point);
//       }
//     }

//     console.log(data);
//     return data;
//   },
// };

// const Collateral = {
//   aave: async () => {},

//   dydx: async () => {},

//   compound: async () => {},
// };

// module.exports = {
//   Borrow,
//   Collateral,
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
    daiDeployData.startBlock
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
  console.log(arr[oldestIndex]);
  const eventMap = {
    dbEvents: daiBorrowEvents,
    dpEvents: daiPaybackEvents,
    ubEvents: usdcBorrowEvents,
    upEvents: usdcPaybackEvents,
  };
  const daiData = [];
  const usdcData = [];
  let currentDebt = 0;
  for (let i = arr[oldestIndex]; i < currentBlock; i++) {
    const daiAvailableEvents = searchEvents(
      [eventMap.dbEvents, eventMap.dpEvents],
      i
    );

    const usdcAvailableEvents = searchEvents(
      [eventMap.ubEvents, eventMap.upEvents],
      i
    );
  }

  let totalDaiBorrowed = 0;
  let totalDaiPayedback = 0;

  daiBorrowEvents.forEach((e) => {
    const amount = parseFloat(
      ethers.utils.formatUnits(e.args.amount.toString(), 18)
    );
    totalDaiBorrowed += amount;
  });

  daiPaybackEvents.forEach((e) => {
    const amount = parseFloat(
      ethers.utils.formatUnits(e.args.amount.toString(), 18)
    );
    totalDaiPayedback += amount;
  });

  console.log(totalDaiBorrowed);
  console.log(totalDaiPayedback);

  console.log(daiBorrowEvents[0].blockNumber);
  console.log(daiBorrowEvents[daiBorrowEvents.length - 1].blockNumber);

  console.log(daiPaybackEvents[0].blockNumber);
  console.log(daiPaybackEvents[daiPaybackEvents.length - 1].blockNumber);
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
