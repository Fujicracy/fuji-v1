const VPRepresenter = require("../../representers/vaultPointRepresenter");

const lastBlock = async () => {
  const points = await VPRepresenter.many();
  let lastBlock;
  if (points.points.length < 1) {
    lastBlock = 0;
  } else {
    lastBlock = points.points[points.points.length - 1].blocknumber;
  }
  return lastBlock;
};

module.exports = { lastBlock };
