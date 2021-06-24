const { VaultPoint } = require("../db");

const getPoints = async (vault, type) => {
  const points = await VaultPoint.find().$where(() => {
    return this.vault === vault, this.type === type;
  });

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
