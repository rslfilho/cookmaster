const property = {
  users: 'user',
  recipes: 'recipe',
};

const errors = {
  badRequest: {
    statusCode: 400,
    code: 'bad_request',
    message: 'Invalid entries. Try again.',
  },
  conflict: {
    statusCode: 409,
    code: 'conflict',
    message: 'Email already registered',
  },
};

module.exports = {
  property,
  errors,
};
