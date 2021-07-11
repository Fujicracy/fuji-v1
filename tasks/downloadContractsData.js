const { Storage } = require('@google-cloud/storage');

const contractList = require('./contracts');

// The ID of GCS bucket
const bucketName = 'fuji-mainnet-eth';

// Creates a client
const storage = new Storage();

async function download(file) {
  try {
    await storage
      .bucket(bucketName)
      .file(`contracts/${file}`)
      .download({
        destination: `./packages/react-app/src/contracts/${file}`,
      });
    console.log(`Downloaded ${file} to "react-app/src/contracts"`);

    await storage
      .bucket(bucketName)
      .file(`contracts/${file}`)
      .download({
        destination: `./packages/bots/contracts/${file}`,
      });
    console.log(`Downloaded ${file}  to "bots/contracts"`);
  } catch (e) {
    console.error(e.message);
  }
}

async function downloadContractsData() {
  for (let i = 0; i < contractList.length; i++) {
    const contractName = contractList[i];

    await download(`${contractName}.address.js`);
    await download(`${contractName}.abi.js`);
    await download(`${contractName}.bytecode.js`);
  }
}

downloadContractsData();
