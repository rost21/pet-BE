// #1 Import the constructor Schema and the model() method
// Note the use of ES6 destructuring
const { Schema, model }  = require('mongoose');

// #2 Instantiate a schema using mongoose Schema
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = Schema({
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
  gender: { type: String, required: true, enum: ['male', 'female'] },
  phone: String,
  dateOfBirth: String,
  location: String,
  role: String,
  isCustomer: { type: Boolean, required: true },
  skills: [{ type: String }],
  rankings: Number,
  about: String,
});

userSchema.plugin(uniqueValidator, {
  message: "Error, user with this {PATH} already exists"
});

// #3 Create a model with mongoose model() method
const User = model('User', userSchema);

module.exports = User;