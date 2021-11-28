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
};

module.exports = errors;
