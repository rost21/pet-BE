const User = require('../models/user.model');
const Project = require('../models/project.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mapUsers = require('../helpers/user');
const mapProjects = require('../helpers/project');

const queries = {
  users: async () => {
    try {
      const users = await User.find({});
      const res = mapUsers(users);
      return res;
    } catch (e) {
      console.log('errors: ', e)
      return Promise.reject(new Error(e));
    }
  },
  login: async (parent, variables) => {
    console.log('variables: ', variables);
    const { username, password } = variables;
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return { isLoggedIn: false };
      }
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const {
          _id,
          firstname,
          lastname,
          username,
          email,
          password,
          phone,
          dateOfBirth,
          role,
          isCustomer,
          skills,
          rankings
        } = user;
        const token = jwt.sign(
          {
            id: user._id,
            firstname,
            lastname,
            username,
            email,
            password,
            phone,
            dateOfBirth,
            role,
            isCustomer,
            skills,
            rankings
          },
          process.env.JWT_KEY,
          { expiresIn: '6h' }
        );
        return {
          isLoggedIn: true,
          id: _id,
          username,
          email,
          token
        };
      }
      return { isLoggedIn: false };
    } catch (e) {
      console.log('error:', e);
      return { isLoggedIn: false };
    }
  },
  getUser: (parent, variables) => {
    console.log('variables: ', variables);
    const { token } = variables;
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      if (decoded) {
        return decoded;
      } else {
        return null;
      }
    } catch (e) {
      console.log('errors: ', e);
      return Promise.reject(new Error(e));
    }
  },
  projects: async () => {
    try {
      const projects = await Project.find({}).populate('owner');
      const res = mapProjects(projects);
      return res;
    } catch (e) {
      console.log('errors: ', e)
      return Promise.reject(new Error(e));
    }
  }
};

module.exports = queries;
