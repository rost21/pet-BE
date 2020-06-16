const { AuthenticationError } = require("apollo-server-express");
const User = require('../models/user.model');
const Project = require('../models/project.model');
const Task = require('../models/task.model');
const Comment = require('../models/comment.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mapUsers, mapUser } = require('../helpers/user');
const { mapProjects, mapProject } = require('../helpers/project');
const { mapTasks, mapTask } = require('../helpers/task');

const queries = {
  users: async (parent, _, { token }) => {
    try {
      console.log('token: ', token);
      jwt.verify(token, process.env.JWT_KEY);
      const users = await User.find({}).lean();
      return mapUsers(users);
    } catch (e) {
      console.error('errors: ', e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  },
  login: async (parent, { data }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(data)));
    try {
      const { username, password } = data;
      const user = await User.findOne({ username }).lean();
      if (!user) {
        return { isLoggedIn: false };
      }
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const { _id, username, email } = user;
        const token = jwt.sign(
          { _id, username, email },
          process.env.JWT_KEY,
          { expiresIn: '1d' }
        );
        return {
          isLoggedIn: true,
          token
        };
      }
      return { isLoggedIn: false };
    } catch (e) {
      console.error('error:', e);
      return Promise.reject(new Error(e));
    }
  },
  getUser: async (parent, variables) => {
    console.log('variables: ', JSON.parse(JSON.stringify(variables)));
    try {
      const { token } = variables;
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      if (decoded) {
        const { _id } = decoded;
        const user = await User.findOne({ _id }).lean();
        return mapUser(user);
      } else {
        return null;
      }
    } catch (e) {
      console.error('errors: ', e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  },
  projects: async (parent, variables, { token }) => {
    console.log('variables: ', JSON.parse(JSON.stringify(variables)));
    try {
      const { filter: { status, search } } = variables;
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      const { _id } = decoded;
      const projects = await Project.find({ title: new RegExp(search, 'i') })
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
            {
              path: 'comments',
              model: 'Comment',
              populate: {
                path: 'author',
                model: 'User'
              }
            },
          ],
        });
      const mappedProjects = mapProjects(projects);
      let result = [];
      switch (status) {
        case 'active':
          result = mappedProjects.filter(project => project.status !== 'CLOSED');
          break;
        case 'all':
          result = mappedProjects;
          break;
        case 'my':
          result = mappedProjects.filter(project => project.members.some(item => item.id.toString() === _id.toString()) || project.owner.id.toString() === _id.toString());
          break;
        default:
          break;
      }
      return result;
    } catch (e) {
      console.error('errors: ', e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  },
  getProject: async (parent, variables, { token }) => {
    console.log('variables: ', variables);
    try {
      const { id } = variables;
      jwt.verify(token, process.env.JWT_KEY);
      const project = await Project.findById({ _id: id })
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
            {
              path: 'comments',
              model: 'Comment',
              populate: {
                path: 'author',
                model: 'User'
              }
            },
          ],
        });
      return mapProject(project);
    } catch (e) {
      console.error('errors: ', e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  },
  // tasks: async (parent, _, { token }) => {
  //   try {
  //     jwt.verify(token, process.env.JWT_KEY);
  //     const tasks = await Task.find({})
  //       .lean()
  //       .populate('reporter')
  //       .populate('assignTo')
  //       .populate('comments')
  //       .populate('author');
  //     return mapTasks(tasks);
  //   } catch (e) {
  //     console.error('errors: ', e);
  //     if (e.name === 'TokenExpiredError') {
  //       return Promise.reject(new AuthenticationError('Token expired'));
  //     }
  //     return Promise.reject(new Error(e));
  //   }
  // },
  getTask: async (parent, variables, { token }) => {
    console.log('variables: ', variables);
    try {
      const { id } = variables;
      jwt.verify(token, process.env.JWT_KEY);
      const task = await Task.findById({ _id: id })
        .lean()
        .populate('reporter')
        .populate('assignTo')
        .populate({
          path: 'comments',
          model: 'Comment',
          populate: {
            path: 'author',
            model: 'User'
          }
        });
      return mapTask(task);
    } catch (e) {
      console.error(e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  }
};

module.exports = queries;
