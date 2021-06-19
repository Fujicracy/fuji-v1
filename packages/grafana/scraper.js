require("dotenv").config();
const { ethers } = require("ethers");
const { getEvents } = require("./utils/fetch");

const main = async () => {
  let provider;

  if (process.env.PROJECT_ID) {
    provider = new ethers.providers.InfuraProvider(
      "homestead",
      process.env.PROJECT_ID
    );
  }

  let stats;
  if (provider) {
    try {
      stats = await getEvents(provider);
    } catch (err) {
      console.log("tats crash:");
      console.log(err);
    }
  } else {
    console.log("no provider");
  }
  return stats;
};

main();
