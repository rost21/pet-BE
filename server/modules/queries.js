const { AuthenticationError } = require("apollo-server-express");
const User = require('../models/user.model');
const Project = require('../models/project.model');
const Task = require('../models/task.model');
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
    const { username, password } = data;
    try {
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
    const { token } = variables;
    try {
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
  projects: async (parent, { filter }, { token }) => {
    // const decoded = jwt.verify(token, process.env.JWT_KEY);
    // console.log('decoded: ', decoded);
    // if (!decoded) throw new AuthenticationError("You are not authorized");
    try {
      // const { title, member } = filter;
      // const projectFilter = { ...filter };

      // console.log('Object.keys(filter): ', Object.keys(filter));
      // const proj = Object.keys(filter).reduce((acc, item) => {
      //   if (!!filter[item]) {
      //     console.log('item: ', item);
      //     console.log('item: ', filter[item]);
      //     if (item === 'member') {
      //       return { ...acc, member: mongoose.Types.ObjectId(filter[item]) };
      //     }
      //     if (item === 'title') {
      //       return { ...acc, title: { $regex: filter[item] } };
      //     }
      //     return { ...acc, [item]: filter[item] };
      //   }
      //   return { ...acc };
      // }, {});
      jwt.verify(token, process.env.JWT_KEY);
      const projects = await Project.find({})
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
      return mapProjects(projects);
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
    const { id } = variables;
    try {
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
  tasks: async (parent, _, { token }) => {
    try {
      jwt.verify(token, process.env.JWT_KEY);
      const tasks = await Task.find({})
        .lean()
        .populate('reporter')
        .populate('assignTo');
      return mapTasks(tasks);
    } catch (e) {
      console.error('errors: ', e);
      if (e.name === 'TokenExpiredError') {
        return Promise.reject(new AuthenticationError('Token expired'));
      }
      return Promise.reject(new Error(e));
    }
  },
  getTask: async (parent, variables, { token }) => {
    console.log('variables: ', variables);
    const { id } = variables;
    try {
      jwt.verify(token, process.env.JWT_KEY);
      const task = await Task.findById({ _id: id })
        .lean()
        .populate('reporter')
        .populate('assignTo');
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
