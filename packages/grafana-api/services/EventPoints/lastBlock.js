const { EventPoint } = require("../../db");

const lastBlock = async () => {
  const points = await EventPoint.find({})
    .sort({ blockNumber: -1 })
    .limit(1);

  return points.length < 1 ? 0 : points[0].blockNumber;
};

module.exports = { lastBlock };
