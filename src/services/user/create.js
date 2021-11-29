const model = require('../../models/entity');

module.exports = async (user, role) => {
  const newUser = { ...user, role };
  
  const created = await model.collection('users').create(newUser);

  delete created.user.password;

  return created;
};
