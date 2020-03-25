// The file server/config/database.js
// #1 Import mongoose
const mongoose = require('mongoose');

// #2 Create a query string to connect to MongoDB server
const DB_URI = `mongodb+srv://root:${process.env.MONGO_PASSWORD}@cluster0-u4u29.mongodb.net/Main?retryWrites=true&w=majority`;

// #3 Connect to MongoDB
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
  useCreateIndex: true,
  useFindAndModify: false,
});

// #4 Add basic event listeners on the mongoose.connection object
mongoose.connection.once('open', () => console.log('Connected to a MongoDB instance'));
mongoose.connection.on('error', error => console.error(error));

// #5 Export mongoose. You’ll use it in server/server.js file
module.exports = mongoose;