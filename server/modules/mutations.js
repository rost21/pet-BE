const User = require('../models/user.model');
const Project = require('../models/project.model');
const Task = require('../models/task.model');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { mapUser } = require('../helpers/user');
const { mapProject } = require('../helpers/project');
const { mapTask } = require('../helpers/task');

const mutations = {
  register: async (parent, { data }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(data)));
    const { username, email, password, isCustomer } = data;
    try {
      const founded = await User.find({ email }).lean();
      if (founded.length >= 1) {
        return {
          isCreated: false,
          message: 'Error, user with this email already exists'
        };
      }
      const hash = await bcrypt.hash(password, 10);
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        email,
        password: hash,
        isCustomer
      });

      const user = await newUser.save();
      return {
        user: mapUser(user),
        isCreated: true,
      };
    } catch (e) {
      console.log('errors', e);
      return Promise.reject(new Error(e));
    }
  },
  updateUser: async (parent, variables) => {
    console.log('variables: ', JSON.parse(JSON.stringify(variables)));
    const { id, data } = variables;
    try {
      const updatedUser = await User.findByIdAndUpdate({ _id: id}, data, { new: true }).lean();
      return { user: mapUser(updatedUser), isUpdated: true };
    } catch (e) {
      console.log(e);
      return Promise.reject(new Error(e));
    }
  },
  deleteUser: async (parent, { id }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(id)));
    try {
      const res = await User.deleteOne({ _id: id });
      return !!res.deletedCount;
    } catch (e) {
      console.log('errors: ', e);
      return Promise.reject(new Error(e));
    }
  },
  createProject: async (parent, { data }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(data)));
    try {
      const newProject = new Project({
        _id: new mongoose.Types.ObjectId(),
        ...data
      });
      const res = await newProject.save();
      const populated = await res.populate('owner').populate('members').populate('tasks').execPopulate();
      return { project: mapProject(populated), isCreated: true };
    } catch (e) {
      console.log('errors: ', e);
      return Promise.reject(new Error(e));
    }
  },
  updateProject: async (parent, variables) => {
    console.log('variables: ', JSON.parse(JSON.stringify(variables)));
    const { id, data } = variables;
    try {
      const updatedProject = await Project.findByIdAndUpdate({ _id: id}, data, { new: true })
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
      return Promise.reject(new Error(e));
    }
  },
  deleteProject: async (parent, { id }) => {
    console.log('variables: ', id);
    try {
      const res = await Project.deleteOne({ _id: id });
      return !!res.deletedCount;
    } catch (e) {
      console.error(e);
      return Promise.reject(new Error(e));
    }
  },
  createTask: async (parent, variables) => {
    console.log('variables: ', JSON.parse(JSON.stringify(variables)));
    const { projectId, data } = variables;
    try {
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
      return Promise.reject(new Error(e));
    }
  },
  updateTask: async (parent, variables) => {
    console.log('variables: ', JSON.parse(JSON.stringify(variables)));
    const { id, data } = variables;
    try {
      const updatedTask = await Task.findByIdAndUpdate({ _id: id}, data, { new: true })
        .lean()
        .populate('reporter')
        .populate('assignTo');
      return { task: mapTask(updatedTask), isUpdated: true };
    } catch (e) {
      console.error(e);
      return Promise.reject(new Error(e));
    }
  },
  deleteTask: async (parent, { id }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(id)));
    try {
      const res = await Task.deleteOne({ _id: id });
      return !!res.deletedCount;
    } catch (e) {
      console.error(e);
      return Promise.reject(new Error(e));
    }
  }
};

module.exports = mutations;
