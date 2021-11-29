const { StatusCodes } = require('http-status-codes');
const recipeService = require('../../services/recipe');
const { errors } = require('../../helpers');

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const recipe = await recipeService.getById(id);
  if (!recipe) return next(errors.recipeNotFound);

  res.status(StatusCodes.OK).json(recipe);
};
