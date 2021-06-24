const mongoose = require("mongoose");

const Schema = mongoose.Schema;

pointSchema = new Schema({
  vault: String,
  type: String,
  value: Number,
  timestammp: Number,
  blocknumber: Number,
  tx: String,
});

const VaultPoint = mongoose.model("Point", pointSchema);

module.exports = VaultPoint;
