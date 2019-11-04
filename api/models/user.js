const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  login: String,
  password: String,
  firstName: String,
  lastName: String
});

module.exports = mongoose.model("User", userSchema);
