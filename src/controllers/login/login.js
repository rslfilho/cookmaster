const { StatusCodes } = require('http-status-codes');
const { errors } = require('../../helpers');
const { createToken } = require('../../helpers/jwtValidation');
const validate = require('../../services/validation');
const userService = require('../../services/user');

module.exports = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(errors.emptyFields);

  if (!await validate.validateLogin(email, password)) return next(errors.incorrectFields);

  const user = await userService.getByEmail(email);
  delete user.password;

  const token = createToken(user);

  res.status(StatusCodes.OK).json({ token });
};
