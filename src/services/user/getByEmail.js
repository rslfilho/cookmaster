const model = require('../../models/entity');

module.exports = async (email) => {
  const user = await model.collection('users').getByEmail(email);

  return user;
};
