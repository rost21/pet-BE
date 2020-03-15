// #1 Import the constructor Schema and the model() method
// Note the use of ES6 desctructuring
const { Schema, model } = require('mongoose');

// #2 Instantiate a schema using mongoose Schema
const uniqueValidator = require('mongoose-unique-validator');

const projectSchema = Schema({
  id: Schema.Types.ObjectId,
  title: { type: String, required: true },
  shortDescription: String,
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
  startDate: { type: Number, default: new Date().getTime() },
  endDate: Number
});

projectSchema.plugin(uniqueValidator, {
  message: 'Error, project with this {PATH} already exists'
});

// #3 Create a model with mongoose model() method
const Project = model('Project', projectSchema);

module.exports = Project;
