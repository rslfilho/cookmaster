const createModel = require('./create');
const getByIdModel = require('./getById');
const getByEmailModel = require('./getByEmail');
const getAllModel = require('./getAll');
// const updateModel = require('./update');
const removeModel = require('./delete');
// const updateQuantityModel = require('./updateQuantity');

module.exports = {
  collection: (collection) => ({
    create: async (doc) => createModel(collection, doc),
    getById: async (id) => getByIdModel(collection, id),
    getByEmail: async (email) => getByEmailModel(collection, email),
    getAll: async () => getAllModel(collection),
    // update: async (id, doc) => updateModel(collection, id, doc),
    remove: async (id) => removeModel(collection, id),
    // updateQuantity: async (id, quantity) => updateQuantityModel(id, quantity),
  }),
};
