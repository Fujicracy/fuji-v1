const { Storage } = require('@google-cloud/storage');

const contractList = require('./contracts.js');

// The ID of GCS bucket
const bucketName = 'fuji-mainnet-eth';

// Creates a client
const storage = new Storage({ keyFilename: './goog-auth.json' });

async function upload(file) {
  try {
    await storage.bucket(bucketName).upload(`./packages/react-app/src/contracts/${file}`, {
      destination: `contracts/${file}`,
    });
    console.log(`Uploaded ${file} to bucket ${bucketName}`);
  } catch (e) {
    console.error(e.message);
  }
}

async function uploadContractsData() {
  for (let i = 0; i < contractList.length; i++) {
    const contractName = contractList[i];

    await upload(`${contractName}.address.js`);
    await upload(`${contractName}.abi.js`);
    await upload(`${contractName}.bytecode.js`);
  }
}

uploadContractsData();
