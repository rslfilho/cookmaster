const { StatusCodes } = require('http-status-codes');
const recipeService = require('../../services/recipe');
const { errors } = require('../../helpers');
const jwt = require('../../helpers/jwtValidation');

module.exports = async (req, res, next) => {
  const { name, ingredients, preparation } = req.body;
  const { authorization: token } = req.headers;

  if (!name || !ingredients || !preparation) return next(errors.badRequest);

  const decoded = jwt.validateToken(token);

  if ('message' in decoded) return next(errors.jwtMalformed);

  const { _id: userId } = decoded;

  const created = await recipeService.create({ name, ingredients, preparation, userId });

  res.status(StatusCodes.CREATED).json(created);
};
