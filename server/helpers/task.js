const { mapUser } = require('./user');

const mapTask = task => {
  if (!task) return null;
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    type: task.type,
    reporter: mapUser(task.reporter),
    assignTo: mapUser(task.assignTo),
    status: task.status
  };
};

const mapTasks = tasks => tasks.map(task => mapTask(task));

module.exports = { mapTasks, mapTask };
