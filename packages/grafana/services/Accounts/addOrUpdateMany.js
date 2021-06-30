const { Account } = require("../../db");

const isDiff = (newBalance) => {
  return !(
    newBalance.ETHDAI.debt === 0 &&
    newBalance.ETHDAI.coll === 0 &&
    newBalance.ETHUSDC.debt === 0 &&
    newBalance.ETHUSDC.coll === 0
  );
};
const isUnique = async (address) => {
  const points = await Account.find({
    address,
  }).exec();
  if (points.length > 0) {
    // console.log(points);
  }
  //   console.log(points);
  return points.length === 0;
};

const test = {
  ETHDAI: { debt: 0, coll: 0 },
  ETHUSDC: { debt: 0, coll: 0 },
};

const combineBalance = (oldBalance, newBalance) => {
  const obj = {
    ETHDAI: oldBalance.get("ETHDAI"),
    ETHUSDC: oldBalance.get("ETHUSDC"),
  };
  obj.ETHDAI.debt += newBalance["ETHDAI"].debt;
  obj.ETHDAI.coll += newBalance["ETHDAI"].coll;
  obj.ETHUSDC.debt += newBalance["ETHUSDC"].debt;
  obj.ETHUSDC.coll += newBalance["ETHUSDC"].coll;
  return obj;
};

const update = async (address, vaultBalances) => {
  const acc = (await Account.find({ address }))[0];
  const newBalances = combineBalance(acc.vaultBalances, vaultBalances);
  await Account.update({ address }, { vaultBalances: newBalances });
};

const addOrUpdateMany = async (obj) => {
  const arr = Object.entries(obj);
  //   console.log(arr);
  for (let i = 0; i <= arr.length - 1; i++) {
    // console.log(arr.length);
    // console.log(i);
    const [address, vaultBalances] = arr[i];
    if (await isUnique(address)) {
      await Account.create({ address, vaultBalances });
      // console.log("unique");
    } else {
      if (isDiff(vaultBalances)) {
        await update(address, vaultBalances);
        // console.log("updated");
      } else {
        // console.log("not unique");
      }
    }
  }
};

module.exports = { addOrUpdateMany };
