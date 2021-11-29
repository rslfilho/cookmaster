const { StatusCodes } = require('http-status-codes');
const recipeService = require('../../services/recipe');
const { errors } = require('../../helpers');

module.exports = async (req, res, next) => {
  const { id: recipeId } = req.params;
  const { _id: userIdEditing } = req.user;
  const { name, ingredients, preparation } = req.body;

  const response = await recipeService
    .update(recipeId, userIdEditing, { name, ingredients, preparation });

  if ('code' in response) return next(errors.userNotCreatorOrAdmin);
  
  res.status(StatusCodes.OK).json(response);
};
