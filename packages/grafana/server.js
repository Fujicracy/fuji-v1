const express = require("express");
const { scraper } = require("./scraper");
const { VaultPoint } = require("./db");
const VPRepresenter = require("./representers/vaultPointRepresenter");
const VPService = require("./services/VaultPoints");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();

const logic = async (targets) => {
  const response = [
    { target: "ETHDAI-DEBT", datapoints: [] },
    { target: "ETHDAI-COLL", datapoints: [] },
    { target: "ETHUSDC-DEBT", datapoints: [] },
    { target: "ETHUSDC-COLL", datapoints: [] },
  ];
  const points = await VPRepresenter.many();
  let lastBlock;
  if (points.points.length < 1) {
    lastBlock = 0;
  } else {
    lastBlock = points.points[points.points.length - 1].blocknumber;
  }

  const newPoints = await scraper(lastBlock);

  console.log("addnew");
  await VPService.addMany(newPoints);
  console.log("addednewifany");

  const daiDebt = (await VPRepresenter.many("ETHDAI", "DEBT")).points;
  const daiColl = (await VPRepresenter.many("ETHDAI", "COLL")).points;
  const usdcDebt = (await VPRepresenter.many("ETHUSDC", "DEBT")).points;
  const usdcColl = (await VPRepresenter.many("ETHDAI", "COLL")).points;

  [...daiDebt, ...daiColl, ...usdcDebt, ...usdcColl].forEach((e) => {
    const type = `${e.vault}-${e.type}`;
    const arr = [e.value, e.timestamp * 1000];
    switch (type) {
      case "ETHDAI-DEBT":
        response[0].datapoints.push(arr);
      case "ETHDAI-COLL":
        response[1].datapoints.push(arr);
      case "ETHUSDC-DEBT":
        response[2].datapoints.push(arr);
      case "ETHUSDC-COLL":
        response[3].datapoints.push(arr);
    }
  });

  return response.filter((e) => targets.includes(e.target));
};

app.post("/query", jsonParser, async (req, res) => {
  console.log("query");
  console.log(req.body);
  const targets = req.body.targets[0].data.only;
  const metrics = await logic(targets);
  res.send(JSON.stringify(metrics));
});

app.post("/search", jsonParser, async (req, res) => {
  console.log(req);
  console.log("search");
  res.send(["ETHDAI-DEBT", "ETHDAI-COLL", "ETHUSDC-DEBT", "ETHUSDC-COLL"]);
});

app.get("/", async (req, res) => {
  const metrics = await logic([]);
  res.send(JSON.stringify(metrics));
});

app.listen(4000, () => {
  console.log("server started");
});
