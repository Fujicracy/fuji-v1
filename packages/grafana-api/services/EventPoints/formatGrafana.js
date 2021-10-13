const axios = require("axios");
const { EventPoint } = require("../../db");
const { VAULTS } = require("../../consts/vaults");

const MAPPINGS = {
  "DEBT": "Debt",
  "COLL": "Collateral",
  "TOTAL-ADDR": "Total Addresses",
  "TVL": "Total Value Locked",
  "TVB": "Total Value Borrowed",
};

const getTargetName = ({ type, props }) => {
  if (type === "vault") {
    const vault = Object.values(VAULTS).find(v => v.name === props.name)
    const assetName = vault.collateralAsset.name;
    return `${MAPPINGS[props.assetType]} (${assetName})`;
  } else if (type === "stats") {
    return MAPPINGS[props.name];
  }
};

const getETHPrice = async () => {
  return axios
    .get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    .then(({ data }) => data.ethereum.usd);
};

const formatGrafana = async (targets) => {
  const events = await EventPoint.find({}).sort({ blockNumber: 1 });
  const ethPrice = await getETHPrice();

  const response = [];

  targets.forEach((target, i) => {
    response[i] = {
      target: getTargetName(target),
      datapoints: []
    };
    const { type, props } = target;

    let [totalColl, totalDebt, totalAddr] = [0, 0, 0];
    let users = [];

    events.forEach(({ vaultName, market, eventName, user, amount, timestamp }) => {
      const ts = timestamp * 1000;
      const vaultFilters = props.name === vaultName && props.market === market;

      if (
        (type === "vault" && props.assetType === "COLL" && vaultFilters) ||
        (type === "stats" && props.name === "TVL")
      ) {
        if (eventName === "Deposit") {
          totalColl += amount * ethPrice;
          response[i].datapoints.push([totalColl, ts]);
        } else if (eventName === "Withdraw") {
          totalColl -= amount * ethPrice;
          response[i].datapoints.push([totalColl, ts]);
        }
      } else if (
        (type === "vault" && props.assetType === "DEBT" && vaultFilters) ||
        (type === "stats" && props.name === "TVB")
      ) {
        if (eventName === "Borrow") {
          totalDebt += amount;
          response[i].datapoints.push([totalDebt, ts]);
        } else if (type === "Payback") {
          totalDebt -= amount;
          response[i].datapoints.push([totalDebt, ts]);
        }
      } else if (type === "stats" && props.name === "TOTAL-ADDR") {
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
