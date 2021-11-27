const model = require('../../models/entity');

module.exports = async (user, role) => model.collection('users').create(user, role);