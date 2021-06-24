const express = require("express");
const { scraper } = require("./scraper");
const { VaultPoint } = require("./db");
const VPRepresenter = require("./representers/vaultPointRepresenter");
const VPService = require("./services/VaultPoints");
const app = express();

app.get("/metrics", async (req, res) => {
  let daiDebtPoints = await VPRepresenter.many("ETHDAI", "DEBT");
  let daiCollPoints = await VPRepresenter.many("ETHDAI", "COLL");
  let usdcDebtPoints = await VPRepresenter.many("ETHUSDC", "DEBT");
  let usdcCollPoints = await VPRepresenter.many("ETHUSDC", "COLL");

  console.log(daiDebtPoints);
  // const latestDaiDebtPoint
  const newPoints = await scraper();
  await VPService.addMany(newPoints);

  daiDebtPoints = await VPRepresenter.many("ETHDAI", "DEBT");
  daiCollPoints = await VPRepresenter.many("ETHDAI", "COLL");
  usdcDebtPoints = await VPRepresenter.many("ETHUSDC", "DEBT");
  usdcCollPoints = await VPRepresenter.many("ETHUSDC", "COLL");

  res.send(daiDebtPoints);
});

app.listen(4000, () => {
  console.log("server started");
});
