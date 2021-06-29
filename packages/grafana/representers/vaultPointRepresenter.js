const { VaultPoint } = require("../db");

const getPoints = async (vault, type) => {
  let points;
  if (vault && type) {
    points = await VaultPoint.find({ vault, type }).sort({
      blocknumber: "asc",
    });
  } else {
    points = await VaultPoint.find().sort({ blocknumber: "asc" });
  }

  if (points.length) {
    points.sort((a, b) => a.blocknumber - b.blocknumber);
  }
  return points;
};

const shape = async (vault, type) => {
  return {
    vault,
    type,
    points: await getPoints(vault, type),
  };
};

module.exports = {
  many: shape,
};
