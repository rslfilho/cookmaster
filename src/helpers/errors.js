const errors = {
  badRequest: {
    statusCode: 400,
    code: 'bad_request',
    message: 'Invalid entries. Try again.',
  },
  emailExists: {
    statusCode: 409,
    code: 'conflict',
    message: 'Email already registered',
  },
  emptyFields: {
    statusCode: 401,
    code: 'unauthorized',
    message: 'All fields must be filled',
  },
  incorrectFields: {
    statusCode: 401,
    code: 'unauthorized',
    message: 'Incorrect username or password',
  },
  jwtMalformed: {
    statusCode: 401,
    code: 'unauthorized',
    message: 'jwt malformed',
  },
  recipeNotFound: {
    statusCode: 404,
    code: 'not_found',
    message: 'recipe not found',
  },
};

module.exports = errors;
