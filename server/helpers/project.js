const { mapUser, mapUsers } = require('./user');
const { mapTasks } = require('./task');

const mapProject = project => {
  if (!project) return null;
  return {
    id: project._id,
    title: project.title,
    shortDescription: project.shortDescription,
    owner: mapUser(project.owner),
    status: project.status,
    members: mapUsers(project.members),
    tasks: mapTasks(project.tasks),
    startDate: project.startDate,
    endDate: project.endDate
  };
};

const mapProjects = projects => projects.map(project => mapProject(project));

module.exports = { mapProjects, mapProject };
