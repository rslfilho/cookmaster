const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connection = async () => {
  const DBServer = await MongoMemoryServer.create();
  const URLMock = DBServer.getUri();

  return MongoClient.connect(URLMock, OPTIONS);
};

module.exports = { connection };