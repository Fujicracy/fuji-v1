require('dotenv').config();

const { ethers } = require('ethers');
const { loadContracts } = require('./utils');

const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER_URL);

async function init() {
  const contracts = await loadContracts(provider);
  const user1 = provider.getSigner(1);
  const user2 = provider.getSigner(2);

  const depositAmount = ethers.utils.parseEther('1');
  const borrowAmount = ethers.utils.parseUnits('1000', 18);
  await contracts.VaultETHDAI.connect(user1)
    .depositAndBorrow(depositAmount, borrowAmount, { value: depositAmount })
    .then(console.log)
    .catch(console.log);
  await contracts.VaultETHDAI.connect(user2)
    .depositAndBorrow(depositAmount, borrowAmount, { value: depositAmount })
    .then(console.log)
    .catch(console.log);
}

init();
