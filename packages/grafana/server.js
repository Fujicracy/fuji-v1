const express = require("express");
const { scraper } = require("./scraper");
const { VaultPoint } = require("./db");
const VPRepresenter = require("./representers/vaultPointRepresenter");
const VPService = require("./services/VaultPoints");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();

app.post("/query", jsonParser, async (req, res) => {
  const targets = req.body.targets[0].data.only;
  const lastBlock = await VPService.lastBlock();
  const newPoints = await scraper(lastBlock);
  await VPService.addMany(newPoints);
  const points = (await VPRepresenter.many()).points;
  const metrics = VPService.formatGrafana(points, targets);
  res.send(metrics);
});

app.post("/search", jsonParser, async (req, res) => {
  console.log(req);
  console.log("search");
  res.send(["ETHDAI-DEBT", "ETHDAI-COLL", "ETHUSDC-DEBT", "ETHUSDC-COLL"]);
});

app.get("/", async (req, res) => {
  res.send(JSON.stringify([]));
});

app.listen(4000, () => {
  console.log("server started");
});
