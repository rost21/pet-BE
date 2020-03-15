const User = require('../models/user.model');
const Project = require('../models/project.model');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const mutations = {
  register: async (parent, variables) => {
    console.log('variables: ', variables);
    const { username, email, password, isCustomer } = variables;
    try {
      const founded = await User.find({ email: email });
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

      await newUser.save();
      return { isCreated: true, message: 'Successful registration' };
    } catch (e) {
      console.log('errors', e);
      return { isCreated: false, message: e };
    }
  },
  deleteUser: async (parent, variables) => {
    console.log('variables: ', variables);
    const { id } = variables;
    try {
      const res = await User.deleteOne({ _id: id });
      return res.deletedCount
    } catch (e) {
      console.log('errors: ', e);
      return false;
    }
  },
  createProject: async (parent, variables) => {
    const { project } = variables;
    try {
      const newProject = new Project({
        _id: new mongoose.Types.ObjectId(),
        ...project,
      })
      console.log(newProject, 'new');
      const res = await newProject.save();
      return { project: res, isCreated: true };
    } catch (e) {
      console.log('errors: ', e);
      return { project: null, isCreated: false };
    }
  }
};

module.exports = mutations;
