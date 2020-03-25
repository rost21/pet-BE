const mapUser = user => {
  if (!user) return null;
  return {
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    email: user.email,
    password: user.password,
    phone: user.phone,
    dateOfBirth: user.dateOfBirth,
    role: user.role,
    isCustomer: user.isCustomer,
    skills: user.skills,
    rankings: user.rankings
  };
};

const mapUsers = users => users.map(user => mapUser(user));

module.exports = { mapUsers, mapUser };
