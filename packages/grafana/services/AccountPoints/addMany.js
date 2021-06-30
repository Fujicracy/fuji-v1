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
    await AccountPoint.find({}).sort({ blocknumber: -1 }).limit(1).exec()
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
  const obj = {};
  Object.entries(newPoint.accounts).forEach(([key, value]) => {
    if (oldPoint.get(key)) {
      obj[key] = combineBalance(oldPoint.get(key), value);
    } else {
      obj[key] = value;
    }
  });
  return obj;
};

const addMany = async (arr) => {
  //   console.log(arr);
  const lastP = await lastPoint();
  // console.log(lastP);
  let rollingP;
  // console.log(arr);
  for (let i = 0; i <= arr.length - 1; i++) {
    // console.log(arr.length);
    // console.log(i);
    const point = arr[i];
    if (await isUnique(point.blocknumber, point.timestamp)) {
      if (lastP) {
        rollingP = combinePoint(lastP, point);
      } else {
        rollingP = point;
      }
      const { blocknumber, timestamp } = point;
      await AccountPoint.create({
        accountsStatus: rollingP.accounts,
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
