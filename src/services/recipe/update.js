const model = require('../../models/entity');

module.exports = async (id, userIdEditing, doc) => {
  const { userId: userIdStoraged } = await model.collection('recipes').getById(id);

  const { role } = await model.collection('users').getById(userIdEditing);
  
  if (userIdEditing !== userIdStoraged && role !== 'admin') {
    return { code: 'userNotCreatorOrAdmin' };
  }

  const updated = await model.collection('recipes').update(id, doc);

  return { ...updated, userId: userIdStoraged };
};
