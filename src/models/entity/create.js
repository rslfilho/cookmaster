const connection = require('../connection');
const { property } = require('../../helpers');

module.exports = async (collection, doc) => {
  const { insertedId: _id } = await (await connection())
    .collection(collection)
    .insertOne({
    ...doc,
  });

  return {
    [property[collection]]: {
      _id,
      ...doc,
    },
  };
};
