const { ObjectId } = require('mongodb');
const connection = require('../connection');

module.exports = async (collection, id, doc) => {
  (await connection())
    .collection(collection)
    .updateOne(
      { _id: ObjectId(id) },
      { $set: doc },
      );

  return {
    _id: id,
    ...doc,
  };
};
