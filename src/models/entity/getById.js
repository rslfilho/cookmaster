const { ObjectId } = require('mongodb');
const connection = require('../connection');

module.exports = async (collection, id) => {
  if (!ObjectId.isValid(id)) return false;
  const data = await (await connection()).collection(collection).findOne(ObjectId(id));

  if (!data) return null;

  return data;
};
