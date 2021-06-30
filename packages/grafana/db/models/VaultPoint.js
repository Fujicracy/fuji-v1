const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pointSchema = new Schema({
  vault: String,
  type: String,
  value: Number,
  timestamp: { type: Number, required: [true, "need timestamp"] },
  blocknumber: Number,
  tx: String,
});

const VaultPoint = mongoose.model("Point", pointSchema);

module.exports = VaultPoint;
