const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  eventName: String,
  user: String,
  vaultName: String,
  market: String,
  amount: Number,
  blockNumber: Number,
  timestamp: { type: Number, required: [true, "need timestamp"] },
});

const EventPoint = mongoose.model("eventPoint", EventSchema);

module.exports = EventPoint;
