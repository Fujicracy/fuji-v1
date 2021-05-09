const path = require('path');
const express = require('express');
const { Storage } = require('@google-cloud/storage');
const contractList = require("./src/contracts/contracts.js");

const app = express();
const port = Number(process.env.PORT) || 3000;

// Creates a client
const storage = new Storage();
const bucket = storage.bucket('fuji-mainnet-eth');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/contracts-data', async (req, res) => {
  const fileName = `contracts/${req.query.name}.${req.query.type}.js`;
  const file = await bucket.file(fileName).download();
  const str = Buffer.from(file[0], "base64").toString();

  // remove "module.exports = " at the beginning and ";" at the end
  const data = str.substring(17, str.length - 1).replace(/\s/g,'');
  res.send(JSON.parse(data));
});

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Up and  running on http://localhost:${port}`);
});
