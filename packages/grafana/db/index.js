const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/fuji");
const VaultPoint = require("./models/VaultPoint");
const AccountPoint = require("./models/AccountPoint");
const Account = require("./models/Account");

module.exports = { VaultPoint, AccountPoint, Account };
