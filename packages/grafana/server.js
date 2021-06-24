const express = require("express");
const { scraper } = require("./scraper");
const { VaultPoint } = require("./db");
const VPRepresenter = require("./representers/vaultPointRepresenter");
const VPService = require("./services/VaultPoints");
const app = express();

app.get("/metrics", async (req, res) => {
  const points = await VPRepresenter.many();
  const lastBlock = points.points[points.points.length - 1].blocknumber;

  const newPoints = await scraper(lastBlock);

  console.log("addnew");
  await VPService.addMany(newPoints);
  console.log("addednewifany");

  const daiDebt = (await VPRepresenter.many("ETHDAI", "DEBT")).points;
  const daiColl = (await VPRepresenter.many("ETHDAI", "COLL")).points;
  const usdcDebt = (await VPRepresenter.many("ETHUSDC", "DEBT")).points;
  const usdcColl = (await VPRepresenter.many("ETHDAI", "COLL")).points;

  const metrics = {
    daiDebt,
    daiColl,
    usdcDebt,
    usdcColl,
  };

  res.send(points);
});

app.listen(4000, () => {
  console.log("server started");
});
