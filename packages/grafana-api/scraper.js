require("dotenv").config();

const { ethers } = require("ethers");
const { getEvents } = require("./utils/getEvents");

const scraper = async (fromLast) => {
  let provider;

  if (process.env.INFURA_ID) {
    provider = new ethers.providers.InfuraProvider(
      "homestead",
      process.env.INFURA_ID
    );
  }

  let stats;
  if (provider) {
    try {
      console.log("scraper started");
      stats = await getEvents(provider, fromLast);
      console.log("scraper ended");
    } catch (err) {
      console.log("stats crash:");
      console.log(err);
    }
  } else {
    console.log("no provider");
  }
  return stats;
};

module.exports = { scraper };
