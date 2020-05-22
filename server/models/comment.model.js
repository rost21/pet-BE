// #1 Import the constructor Schema and the model() method
// Note the use of ES6 destructuring
const { Schema, model }  = require('mongoose');

// #2 Instantiate a schema using mongoose Schema
const uniqueValidator = require("mongoose-unique-validator");

const commentSchema = Schema({
  comment: { type: String, required: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  postedDate: { 
    type: String, 
    required: true, 
    default: new Date().getTime() 
  },
});

commentSchema.plugin(uniqueValidator, {
  message: "Error, task with this {PATH} already exists"
});

// #3 Create a model with mongoose model() method
const Comment = model('Comment', commentSchema, 'comments');

module.exports = Comment;