// #1 Import the constructor Schema and the model() method
// Note the use of ES6 destructuring
const { Schema, model } = require('mongoose');

// #2 Instantiate a schema using mongoose Schema
const uniqueValidator = require('mongoose-unique-validator');

const projectSchema = Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['NOT PAID', 'PAID', 'CLOSED'],
    default: 'NOT PAID'
  },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  startDate: { type: String, default: new Date().getTime() },
  endDate: String,
});

projectSchema.plugin(uniqueValidator, {
  message: 'Error, project with this {PATH} already exists'
});

// #3 Create a model with mongoose model() method
const Project = model('Project', projectSchema);

module.exports = Project;
