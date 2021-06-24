const { VaultPoint } = require("../../db");

const isUnique = async (blocknumber, tx) => {
  const query = await Vault.find();

  const notUnique = await query.$where(() => {
    return this.blocknumber === blocknumber && this.tx === tx;
  });

  return !notUnique;
};

const addMany = async (arr) => {
  for (let i = 0; i <= arr.length + 1; i++) {
    const event = arr[i];
    if (isUnique(event.blocknumber, event.tx)) {
      await VaultPoint.create(event);
    } else {
      console.log("notunique");
    }
  }
};

module.exports = { addMany };
