const { VaultPoint } = require("../../db");

const isUnique = async (blocknumber, type, vault, tx, timestamp) => {
  const points = await VaultPoint.find({
    blocknumber,
    tx,
    type,
    vault,
    timestamp,
  }).exec();
  if (points.length > 0) {
    // console.log(points);
  }
  //   console.log(points);
  return points.length === 0;
};

const addMany = async (arr) => {
  //   console.log(arr);
  for (let i = 0; i <= arr.length - 1; i++) {
    // console.log(arr.length);
    // console.log(i);
    const event = arr[i];
    if (
      await isUnique(
        event.blocknumber,
        event.type,
        event.vault,
        event.tx,
        event.timestamp
      )
    ) {
      await VaultPoint.create(event);
      console.log("unique");
    } else {
      console.log("notunique");
    }
  }
};

module.exports = { addMany };
