const model = require('../../models/entity');

module.exports = async () => model.collection('recipes').getAll();
