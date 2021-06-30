const { AccountPoint } = require("../../db");

const isUnique = async (blocknumber, timestamp) => {
  const points = await AccountPoint.find({
    blocknumber,
    timestamp,
  }).exec();
  if (points.length > 0) {
    // console.log(points);
  }
  //   console.log(points);
  return points.length === 0;
};

const lastPoint = async () => {
  const last = (
    await AccountPoint.find({})
      .select("blocknumber")
      .sort({ blocknumber: -1 })
      .limit(1)
      .exec()
  )[0];
  return last;
};

const combineBalance = (oldBalance, newBalance) => {
  oldBalance.ETHDAI.debt += newBalance.ETHDAI.debt;
  oldBalance.ETHDAI.coll += newBalance.ETHDAI.coll;
  oldBalance.ETHUSDC.debt += newBalance.ETHUSDC.debt;
  oldBalance.ETHUSDC.coll += newBalance.ETHUSDC.coll;
  return oldBalance;
};

const combinePoint = (oldPoint, newPoint) => {
  Object.entries(newPoint).forEach(([key, value]) => {
    if (oldPoint[key]) {
      oldPoint[key] = combineBalance(oldPoint[key], value);
    } else {
      oldPoint[key] = value;
    }
  });
  return oldPoint;
};

const addMany = async (arr) => {
  //   console.log(arr);
  const lastP = await lastPoint();
  let runningP = lastP;
  for (let i = 0; i <= arr.length - 1; i++) {
    // console.log(arr.length);
    // console.log(i);
    const point = arr[i];
    if (await isUnique(point.blocknumber, point.timestamp)) {
      if (lastP) {
        runningP = combinePoint(runningP, point);
      } else {
        runningP = point;
      }
      const { blocknumber, timestamp } = point;
      await AccountPoint.create({
        accountsStatus: runningP.accounts,
        timestamp,
        blocknumber,
      });
      // console.log("unique");
    } else {
      // console.log("notunique");
    }
  }
};

module.exports = { addMany };
