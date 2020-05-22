// #1 Import the constructor Schema and the model() method
// Note the use of ES6 destructuring
const { Schema, model }  = require('mongoose');

// #2 Instantiate a schema using mongoose Schema
const uniqueValidator = require("mongoose-unique-validator");

const taskSchema = Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['bug', 'story', 'improvement'] },
  reporter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: { type: String, enum: ['ready', 'wip', 'done', 'closed'] },
  creationDate: { type: String, required: true },
  closedDate: String,
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

taskSchema.plugin(uniqueValidator, {
  message: "Error, task with this {PATH} already exists"
});

// #3 Create a model with mongoose model() method
const Task = model('Task', taskSchema, 'tasks');

module.exports = Task;