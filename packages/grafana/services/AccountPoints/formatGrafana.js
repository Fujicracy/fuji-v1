const { AccountPoint } = require("../../db");

const formatGrafana = async () => {
  const response = [
    { target: "USERSWITHDEBT", datapoints: [] },
    { target: "USERSWITHONLYCOLL", datapoints: [] },
  ];

  const arr = await AccountPoint.find().sort({ blocknumber: "asc" });

  arr.forEach((e) => {
    console.log(Array.from(e.accountsStatus.entries()).length);
    let debtcount = 0;
    let collcount = 0;
    Array.from(e.accountsStatus.entries()).forEach(([key, value]) => {
      const { ETHDAI, ETHUSDC } = value;
      if (ETHDAI.debt > 0 || ETHUSDC.debt > 0) {
        debtcount += 1;
      }
      if (
        ETHDAI.debt === 0 &&
        ETHUSDC === 0 &&
        (ETHDAI.coll > 0 || ETHUSDC.coll > 0)
      ) {
        collcount += 1;
      }
    });
    response[0].datapoints.push([debtcount, e.timestamp * 1000]);
    response[1].datapoints.push([collcount, e.timestamp * 1000]);
  });

  return response;
};

module.exports = { formatGrafana };
