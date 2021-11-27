const connection = require('../connection');

module.exports = async (collection, email) => {
  const data = await (await connection()).collection(collection).findOne({ email });

  if (!data) return null;

  return data;
};
