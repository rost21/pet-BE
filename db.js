// const MongoClient = require("mongodb").MongoClient;
// const mongoose = require("mongoose");

// mongoose.connect(
//   `mongodb+srv://root:${process.env.MONGO_PASSWORD}@cluster0-u4u29.mongodb.net/test?retryWrites=true&w=majority`,
//   { useMongoClient: true }
// );

// const client = new MongoClient(uri, { useNewUrlParser: true });
// module.exports = {
//   db_connect: () =>
//     client.connect(err => {
//       const collection = client.db("test").collection("devices");
//       // perform actions on the collection object
//       client.close();
//     })
// };
