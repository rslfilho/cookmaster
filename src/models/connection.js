const { MongoClient } = require('mongodb');

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const MONGO_DB_URL = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;
const DB_NAME = 'Cookmaster';

let db = null;

const connection = async () => {
  if (db) return db;
  
  db = (await MongoClient.connect(MONGO_DB_URL, OPTIONS)).db(DB_NAME);

  return db;
};

module.exports = connection;
