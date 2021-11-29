const model = require('../../models/entity');

module.exports = async (id, userIdDeleting) => {
  const { userId: userIdStoraged } = await model.collection('recipes').getById(id);

  const { role } = await model.collection('users').getById(userIdDeleting);
  
  if (userIdDeleting !== userIdStoraged && role !== 'admin') {
    return { code: 'userNotCreatorOrAdmin' };
  }

  await model.collection('recipes').remove(id);

  return { code: 'deleted' };
};
