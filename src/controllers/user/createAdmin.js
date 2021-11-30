const { StatusCodes } = require('http-status-codes');
const userService = require('../../services/user');
const validate = require('../../services/validation');
const { errors } = require('../../helpers');

module.exports = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(errors.badRequest);
  }

  if (await validate.validateEmail(email)) {
    const { code } = await validate.validateEmail(email);
    return next(errors[code]);
  }

  const userCreated = await userService.create({ name, email, password }, 'admin');

  return res.status(StatusCodes.CREATED).json(userCreated);
};
