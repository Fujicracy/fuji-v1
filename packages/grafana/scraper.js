const { ethers } = require("ethers");
const { getCollStat } = require("./utils/collateralHelpers");
const { getBorrStat } = require("./utils/borrowHelpers");

const main = async () => {
  let provider;

  if (provider.env.PROJECT_ID) {
    provider = new ethers.providers.InfuraProvider(
      "homestead",
      process.env.PROJECT_ID
    );
  }

  let collStats;
  let borrStats;
  if (provider) {
    try {
      collStats = await getCollStat(provider);
    } catch (err) {
      console.log("collateral stats crash:");
      console.log(err);
    }

    try {
      borrStats = await getBorrStat(provider);
    } catch (err) {
      console.log("borrow stats crash:");
      console.log(err);
    }
  } else {
    console.log("no provider");
  }
};
