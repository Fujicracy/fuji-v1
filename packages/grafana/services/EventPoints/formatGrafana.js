const axios = require("axios");
const { EventPoint } = require("../../db");

const MAPPINGS = {
  "ETHDAI-DEBT": "Debt (DAI)",
  "ETHDAI-COLL": "Collateral (ETH)",
  "ETHUSDC-DEBT": "Debt (USDC)",
  "ETHUSDC-COLL": "Collateral (ETH)",
  "ETHUSDT-DEBT": "Debt (USDT)",
  "ETHUSDT-COLL": "Collateral (ETH)",
  "TOTAL-ADDR": "Total Addresses",
  "TVL": "Total Value Locked",
  "TVB": "Total Value Borrowed",
};
const getETHPrice = async () => {
  return axios
    .get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    .then(({ data }) => data.ethereum.usd);
};

const formatGrafana = async (targets) => {
  const events = await EventPoint.find({}).sort({ blocknumber: 1 });
  const ethPrice = await getETHPrice();

  const response = [];

  targets.forEach((target, i) => {
    response[i] = {
      target: MAPPINGS[target],
      datapoints: []
    };
    const [prefix, suffix] = target.split("-");

    let [totalColl, totalDebt, totalAddr] = [0, 0, 0];
    let users = [];

    events.forEach(({ vault, type, user, value, timestamp }) => {
      const ts = timestamp * 1000;

      if ((prefix === vault && suffix === "COLL") || prefix === "TVL") {
        if (type === "Deposit" || type === "Withdraw") {
          totalColl += value * ethPrice;
          response[i].datapoints.push([totalColl, ts]);
        }
      } else if ((prefix === vault && suffix === "DEBT" ) || prefix === "TVB") {
        if (type === "Borrow" || type === "Payback") {
          totalDebt += value;
          response[i].datapoints.push([totalDebt, ts]);
        }
      } else if (prefix === "TOTAL" && suffix === "ADDR") {
        if (!users.includes(user)) {
          totalAddr += 1;
          users.push(user);
          response[i].datapoints.push([totalAddr, ts]);
        }
      }
    });
  });

  return response;
}

module.exports = { formatGrafana };
