const mapUsers = require('./user');

const mapProjects = (projects) =>
  projects.map(project => ({
    id: project._id,
    title: project.title,
    shortDescription: project.shortDescription,
    owner: {
      id: project.owner._id,
      firstname: project.owner.firstname,
      lastname: project.owner.lastname,
      username: project.owner.username,
      email: project.owner.email,
      password: project.owner.password,
      phone: project.owner.phone,
      dateOfBirth: project.owner.dateOfBirth,
      role: project.owner.role,
      isCustomer: project.owner.isCustomer,
      skills: project.owner.skills,
      rankings: project.owner.rankings,
    },
    status: project.status,
    members: project.members,
    tasks: project.tasks,
    startDate: project.startDate,
    endDate: project.endDate,
  }));

module.exports = mapProjects;