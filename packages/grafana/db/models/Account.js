const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const account = new Schema({
  address: String,
  vaultBalances: Map,
});

const Account = mongoose.model("Account", account);

module.exports = Account;
