const { mapUser } = require('./user');

const mapComment = comment => {
  if (!comment) return null;
  return {
    ...comment,
    id: comment._id,
    author: mapUser(comment.author),
  };
};

const mapComments = comments => comments.map(comment => mapComment(comment));

module.exports = { mapComment, mapComments };
