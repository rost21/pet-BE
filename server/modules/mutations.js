const User = require('../models/user.model');
const Project = require('../models/project.model');
const Task = require('../models/task.model');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { mapUser } = require('../helpers/user');
const { mapProject } = require('../helpers/project');
const { mapTask } = require('../helpers/task');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require("apollo-server-express");

const emailRegExp = new RegExp(
  // eslint-disable-next-line
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
);

const mutations = {
  register: async (parent, { data }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(data)));
    const { username, email, password } = data;
    try {
      // validation
      if (username.length < 6 || username.length > 20 || password.length < 6 || !emailRegExp.test(email)) {
        return Promise.reject(new Error('Validation error'));
      }

      const foundedByEmail = await User.find({ email }).lean();
      if (foundedByEmail.length >= 1) {
        return {
          isCreated: false,
          message: 'Error, user with this email already exists'
        };
      }
      
      const foundedByUsername = await User.find({ username }).lean();
      if (foundedByUsername.length >= 1) {
        return {
          isCreated: false,
          message: 'Error, user with this username already exists'
        };
      }

      const hash = await bcrypt.hash(password, 10);
      const newUser = new User({
        ...data,
        _id: new mongoose.Types.ObjectId(),
        password: hash,
      });

      await newUser.save();
      
      return { isCreated: true };
    } catch (e) {
      console.log('errors', e);
      return Promise.reject(new Error(e));
    }
  },
  updateUser: async (parent, variables, { token }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(variables)));
    const { id, data } = variables;
    try {
      jwt.verify(token, process.env.JWT_KEY);
      const updatedUser = await User.findByIdAndUpdate({ _id: id}, data, { new: true }).lean();
      return { user: mapUser(updatedUser), isUpdated: true };
    } catch (e) {
      console.log(e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  },
  deleteUser: async (parent, { id }, { token }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(id)));
    try {
      jwt.verify(token, process.env.JWT_KEY);
      const res = await User.deleteOne({ _id: id });
      return !!res.deletedCount;
    } catch (e) {
      console.log('errors: ', e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  },
  createProject: async (parent, { data }, { token }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(data)));
    try {
      jwt.verify(token, process.env.JWT_KEY);
      const id = new mongoose.Types.ObjectId()
      const newProject = new Project({
        _id: id,
        ...data
      });
      await newProject.save();
      const populated = await Project.findById({ _id: id })
        .lean()
        .populate({
          path: 'owner',
          model: 'User',
        })
        .populate({
          path: 'members',
          model: 'User',
        })
        .populate({
          path: 'tasks',
          model: 'Task',
          populate: [
            {
              path: 'reporter',
              model: 'User',
            },
            {
              path: 'assignTo',
              model: 'User',
            },
          ],
        });
      return { project: mapProject(populated), isCreated: true };
    } catch (e) {
      console.log('errors: ', e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  },
  updateProject: async (parent, variables, { token }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(variables)));
    const { id, data } = variables;
    try {
      jwt.verify(token, process.env.JWT_KEY);
      const updatedProject = await Project.findByIdAndUpdate({ _id: id }, data, { new: true })
        .lean()
        .populate({
          path: 'owner',
          model: 'User',
        })
        .populate({
          path: 'members',
          model: 'User',
        })
        .populate({
          path: 'tasks',
          model: 'Task',
          populate: [
            {
              path: 'reporter',
              model: 'User',
            },
            {
              path: 'assignTo',
              model: 'User',
            },
          ],
        });
      return { project: mapProject(updatedProject), isUpdated: true };      
    } catch (e) {
      console.log(e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  },
  deleteProject: async (parent, { id }, { token }) => {
    console.log('variables: ', id);
    try {
      jwt.verify(token, process.env.JWT_KEY);
      const res = await Project.deleteOne({ _id: id });
      return !!res.deletedCount;
    } catch (e) {
      console.error(e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  },
  createTask: async (parent, variables, { token }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(variables)));
    const { projectId, data } = variables;
    try {
      jwt.verify(token, process.env.JWT_KEY);
      const newTask = new Task({
        _id: new mongoose.Types.ObjectId(),
        ...data
      });
      const { tasks } = await Project.findById({ _id: projectId }).lean();
      tasks.push(newTask._id);
      const res = await newTask.save();

      await Project.findByIdAndUpdate({ _id: projectId }, { tasks }, { new: true });
      const populated = await res.populate('reporter').populate('assignTo').execPopulate();
      return { task: mapTask(populated), isCreated: true };
    } catch (e) {
      console.error(e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  },
  updateTask: async (parent, variables, { token }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(variables)));
    const { id, data } = variables;
    try {
      jwt.verify(token, process.env.JWT_KEY);
      const updatedTask = await Task.findByIdAndUpdate({ _id: id}, data, { new: true })
        .lean()
        .populate('reporter')
        .populate('assignTo');
      return { task: mapTask(updatedTask), isUpdated: true };
    } catch (e) {
      console.error(e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  },
  deleteTask: async (parent, { id }, { token }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(id)));
    try {
      jwt.verify(token, process.env.JWT_KEY);
      const res = await Task.deleteOne({ _id: id });
      return !!res.deletedCount;
    } catch (e) {
      console.error(e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  }
};

module.exports = mutations;
