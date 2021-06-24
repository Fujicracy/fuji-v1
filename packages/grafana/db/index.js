const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/fuji");
const VaultPoint = require("./models/VaultPoint");

module.exports = { VaultPoint };
