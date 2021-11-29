const model = require('../models/entity');

const emailExists = async (email) => {
  const found = await model.collection('users').getByEmail(email);

  if (found) return { code: 'emailExists' };
};

const checkEmail = (email) => {
  const regex = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;

  if (!email.match(regex)) return { code: 'badRequest' };
};

const validateEmail = async (email) => {
  if (checkEmail(email)) return checkEmail(email);
  
  if (await emailExists(email)) return emailExists(email);
};

const validateLogin = async (email, password) => {
  const user = await model.collection('users').getByEmail(email);

  if (!user) return false;

  const { password: pass } = user;

  if (password === pass) return true;

  return false;
};

module.exports = {
  validateEmail,
  checkEmail,
  validateLogin,
};
