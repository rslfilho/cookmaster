const connection = require('../connection');
const { property } = require('../../helpers');

module.exports = async (collection, doc, role) => {
  const { insertedId: _id } = await (await connection())
    .collection(collection)
    .insertOne({
    ...doc,
    role,
  });

  const user = { ...doc };

  delete user.password;

  return {
    [property[collection]]: {
      _id,
      role,
      ...user,   
    },
  };
};
