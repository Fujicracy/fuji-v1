const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/fuji");
const EventPoint = require("./models/EventPoint");

// TODO
// const { MongoClient } = require("mongodb");
// const uri =
//   "mongodb+srv://team@angeldao.org@cluster0.nsht4.mongodb.net/data-fetch?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

module.exports = { EventPoint };
