const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountPointSchema = new Schema({
  accountsStatus: Map,
  blocknumber: Number,
  timestamp: Number,
});

const AccountsPoint = mongoose.model("AccountsPoint", accountPointSchema);

module.exports = AccountsPoint;
