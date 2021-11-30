const { errors } = require('../helpers');

module.exports = async (req, _res, next) => {
  const { role } = req.user;

  if (role !== 'admin') return next(errors.onlyAdmins);

  next();
};
