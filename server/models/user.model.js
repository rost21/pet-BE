// #1 Import the constructor Schema and the model() method
// Note the use of ES6 desctructuring
const { Schema, model }  = require('mongoose');

// #2 Instantiate a schema using mongoose Schema
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = Schema({
  id: Schema.Types.ObjectId,
  firstname: String,
  lastname: String,
  username: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  password: { type: String, required: true },
  phone: String,
  dateOfBirth: Number,
  role: String,
  isCustomer: { type: Boolean, required: true },
  skills: String,
  rankings: Number,
});

userSchema.plugin(uniqueValidator, {
  message: "Error, user with this {PATH} already exists"
});

// #3 Create a model with mongoose model() method
const User = model('User', userSchema);

module.exports = User;