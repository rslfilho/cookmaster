const { StatusCodes } = require('http-status-codes');
const recipeService = require('../../services/recipe');
const { errors } = require('../../helpers');

module.exports = async (req, res, next) => {
  const { id: recipeId } = req.params;
  const { _id: userIdEditing } = req.user;

  const fileUrl = `localhost:3000/src/uploads/${recipeId}.jpeg`;

  const response = await recipeService.addImage(recipeId, userIdEditing, fileUrl);

  if ('code' in response) return next(errors.userNotCreatorOrAdmin);

  res.status(StatusCodes.OK).json(response);
};
