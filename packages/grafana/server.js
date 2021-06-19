const express = require("express");
const { scraper } = require("./scraper");

const app = express();

app.get("/metrics", async (req, res) => {
  const metrics = await scraper();
  res.send(metrics);
});

app.listen(4000, () => {
  console.log("server started");
});
