const model = require('../models/entity');

const emailExists = async (email) => {
  const found = await model.collection('users').getByEmail(email);

  if (found) return { code: 'conflict' };
};

const validateEmail = (email) => {
  const regex = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;

  if (!email.match(regex)) return { code: 'badRequest' };
};

const email = async (str) => {
  if (await emailExists(str)) return emailExists(str);

  if (validateEmail(str)) return validateEmail(str);
};

module.exports = {
  email,
};
