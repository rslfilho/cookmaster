const { StatusCodes } = require('http-status-codes');
const recipeService = require('../../services/recipe');
const { errors } = require('../../helpers');

module.exports = async (req, res, next) => {
  const { id: recipeId } = req.params;
  const { _id: userIdDeleting } = req.user;

  const { code } = await recipeService.remove(recipeId, userIdDeleting);

  if (code === 'userNotCreatorOrAdmin') return next(errors.userNotCreatorOrAdmin);

  res.status(StatusCodes.NO_CONTENT).end();
};
