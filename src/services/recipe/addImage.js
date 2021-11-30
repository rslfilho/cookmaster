const model = require('../../models/entity');

module.exports = async (id, userIdEditing, fileUrl) => {
  const recipe = await model.collection('recipes').getById(id);
  const { userId: userIdStoraged } = recipe;
  const { role } = await model.collection('users').getById(userIdEditing);

  if (userIdEditing !== userIdStoraged && role !== 'admin') {
    return { code: 'userNotCreatorOrAdmin' };
  }

  await model.collection('recipes').update(id, { image: fileUrl });

  return { ...recipe, image: fileUrl };
};
