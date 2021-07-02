const express = require("express");
const { scraper } = require("./scraper");
const EPService = require("./services/EventPoints");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const app = express();

app.post("/query", jsonParser, async (req, res) => {
  const targets = req.body.targets[0].data.only;
  const lastBlock = (await EPService.lastBlock()) + 1;
  const eventPoints = await scraper(lastBlock);
  await EPService.addMany(eventPoints);
  const data0 = await EPService.formatGrafana();
  const metrics = data0.filter((e) => targets.includes(e.target));
  console.log(metrics[0].datapoints);
  res.send(metrics);
});

app.post("/search", jsonParser, async (req, res) => {
  console.log("search");
  res.send([]);
});

app.get("/", async (req, res) => {
  console.log("hit");
  res.send(JSON.stringify([]));
});

app.listen(4000, () => {
  console.log("server started");
});
