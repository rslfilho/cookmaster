const { StatusCodes } = require('http-status-codes');
const recipeService = require('../../services/recipe');

module.exports = async (_req, res, next) => {
  try {
    const recipes = await recipeService.getAll();
    res.status(StatusCodes.OK).json(recipes);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
