const model = require('../../models/entity');

module.exports = async ({ name, ingredients, preparation, userId }) => {
  const created = await model
    .collection('recipes')
    .create({ name, ingredients, preparation, userId });

  return created;
};
