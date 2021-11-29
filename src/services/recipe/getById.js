const model = require('../../models/entity');

module.exports = async (id) => model.collection('recipes').getById(id);
