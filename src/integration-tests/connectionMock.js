const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let DBServer;
let URLMock;

const connection = async () => {
  if (DBServer) {
    return MongoClient.connect(URLMock, OPTIONS);
  }
  
  DBServer = new MongoMemoryServer();
  // await DBServer.start();
  URLMock = DBServer.getUri();

  return MongoClient.connect(URLMock, OPTIONS);
};

module.exports = { connection };
