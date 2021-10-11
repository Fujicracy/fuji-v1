const express = require("express");
const { MongoClient } = require("mongodb");
const parser = require("body-parser").json();
const app = express();

const { scraper } = require("./scraper");
const EPService = require("./services/EventPoints");
const RPService = require("./services/RatePoints");

const uri =
  "mongodb+srv://angeldao:ImWSfT8h9IFfS9Nk@cluster0.nsht4.mongodb.net/data-fetch?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect(async (err, db) => {
  app.post("/query", parser, async (req, res) => {
    //const ratesTargets = [
      //"DYDXUSDC",
      //"DYDXDAI",
      //"AAVEUSDC",
      //"AAVEDAI",
      //"COMPOUNDUSDC",
      //"COMPOUNDDAI",
    //];

    //let flag = false;

    const targets = req.body.targets[0].data.only;
    console.log(targets);
    //targets.forEach((e) => {
      //if (ratesTargets.includes(e)) {
        //flag = true;
      //}
    //});
    //if (flag) {
      //const [bundle, isOld] = await RPService.lastRow();
      //if (isOld) {
        //RPService.formatGrafana(db);
      //}
      //const metrics = bundle.rates.filter((e) => targets.includes(e.target));
      //console.log(metrics);
      //res.send(bundle.rates.filter((e) => targets.includes(e.target)));
    //} else {
      const lastBlock = (await EPService.lastBlock()) + 1;
      const eventPoints = await scraper(lastBlock);
      await EPService.addMany(eventPoints);

      const data = await EPService.formatGrafana(targets);
      res.send(data);
    //}
  });

  app.post("/search", parser, async (req, res) => {
    console.log("search");
    res.send([
      "VAULT",
      "STATS",
    ]);
  });

  app.get("/", async (req, res) => {
    console.log("hit");
    res.send(JSON.stringify([]));
  });

  app.listen(4000, () => {
    console.log("server started");
  });
});
