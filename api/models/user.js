const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
});

userSchema.plugin(uniqueValidator, {
  message: "Error, user with this {PATH} already exists"
});

module.exports = mongoose.model("User", userSchema);
