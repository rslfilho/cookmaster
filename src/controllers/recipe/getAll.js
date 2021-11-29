const { StatusCodes } = require('http-status-codes');
const recipeService = require('../../services/recipe');

module.exports = async (_req, res, _next) => {
  const recipes = await recipeService.getAll();
  res.status(StatusCodes.OK).json(recipes);
};
