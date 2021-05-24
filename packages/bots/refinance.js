require("dotenv").config();

const chalk = require("chalk");
const { ethers, Wallet } = require("ethers");
const {
  loadContracts,
  getGasPrice,
  getLiquidationProviderIndex,
} = require("./utils");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.ETHEREUM_PROVIDER_URL
);
let signer;
if (process.env.PRIVATE_KEY) {
  signer = new Wallet(process.env.PRIVATE_KEY, provider);
} else {
  throw new Error('PRIVATE_KEY not set: please, set it in ".env"!');
}

const vaultsList = ["VaultETHDAI", "VaultETHUSDC"];

function getProviderName(providerAddr, contracts) {
  const dydxProviderAddr = contracts.ProviderDYDX.address;
  const aaveProviderAddr = contracts.ProviderAave.address;
  const compoundProviderAddr = contracts.ProviderCompound.address;

  if (providerAddr === dydxProviderAddr) {
    return "ProviderDYDX";
  }
  if (providerAddr === aaveProviderAddr) {
    return "ProviderAave";
  }
  if (providerAddr === compoundProviderAddr) {
    return "ProviderCompound";
  }
  return "";
}

async function switchProviders(contracts, vault, newProviderAddr) {
  const index = await getLiquidationProviderIndex(vault, contracts);
  const gasPrice = await getGasPrice();
  let gasLimit = await contracts.Controller.estimateGas.doRefinancing(
    vault.address,
    newProviderAddr,
    1,
    1,
    index,
    { gasPrice }
  );
  // increase by 10%
  gasLimit = gasLimit.add(gasLimit.div(ethers.BigNumber.from("10")));

  return contracts.Controller.connect(signer).doRefinancing(
    vault.address,
    newProviderAddr,
    1,
    1,
    index,
    { gasPrice, gasLimit }
  );
}

async function shouldChange(currentRate, newRate, lastSwitch) {
  // current provider is still the best
  if (!newRate) {
    return false;
  }
  const BLOCKS_IN_HOUR = 269; // approx.
  // change when difference in APRs is more than 4%
  const APR_THRESHOLD = ethers.utils.parseUnits("4", 25);

  const currentBlockNumber = await provider.getBlockNumber();
  const timeCheck = !lastSwitch
    ? true // first switch
    : // check if last switch was at least 1h ago
      currentBlockNumber - lastSwitch.blockNumber > BLOCKS_IN_HOUR;

  return currentRate.sub(newRate).gte(APR_THRESHOLD) && timeCheck;
}

async function checkRates(vaultName, contracts) {
  console.log("Checking", chalk.yellow(`${vaultName} ...`));
  const vault = contracts[vaultName];
  const { borrowAsset } = await vault.vAssets();
  const activeProviderAddr = await vault.activeProvider();

  const activeProviderName = getProviderName(activeProviderAddr, contracts);

  const currentRate = await contracts[activeProviderName].getBorrowRateFor(
    borrowAsset
  );

  const providers = await vault.getProviders();

  let bestRate = currentRate;
  let bestProviderIndex;
  for (let i = 0; i < providers.length; i++) {
    const providerName = getProviderName(providers[i], contracts);
    const rate = await contracts[providerName].getBorrowRateFor(borrowAsset);

    // determine provider with best rate
    if (rate.lt(bestRate)) {
      bestRate = rate;
      bestProviderIndex = i;
    }
  }

  const filterSwitches = vault.filters.Switch();
  // Filter all Switch events
  const events = await vault.queryFilter(filterSwitches);
  const lastSwitch = events[events.length - 1];
  const toChange = await shouldChange(currentRate, bestRate, lastSwitch);

  if (toChange) {
    console.log(`-> proceed to swtich activeProvider of ${vaultName}`);

    const res = await switchProviders(
      contracts,
      vault,
      providers[bestProviderIndex]
    );

    if (res && res.hash) {
      console.log(`TX submited: ${res.hash}`);
      const receipt = await res.wait();
      if (
        receipt &&
        receipt.events &&
        receipt.events.find((e) => e.event === "Switch")
      ) {
        console.log(
          chalk.blue(`---> successfully switched provider of ${vaultName}`)
        );
      }
    }
  } else {
    console.log(chalk.cyan("-> not due for refinance"));
  }
}

async function checkForRefinance(contracts) {
  for (let v = 0; v < vaultsList.length; v++) {
    const vaultName = vaultsList[v];
    await checkRates(vaultName, contracts);
  }
}

async function main() {
  console.log("Start checking for refinancing...");

  const contracts = await loadContracts(signer);
  await checkForRefinance(contracts);

  // run every 15 min
  setInterval(async () => checkForRefinance(contracts), 15 * 60 * 1000);
}

main();
