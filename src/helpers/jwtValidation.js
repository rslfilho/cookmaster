const jwt = require('jsonwebtoken');

const secret = 'meusegredodificil';
const jwtConfig = {
  expiresIn: '7d',
  algorithm: 'HS256',
};

const createToken = (payload) => {
  const token = jwt.sign(payload, secret, jwtConfig);
  return token;
};

const validateToken = (token) => {
  const decoded = jwt.verify(token, secret);
  return decoded;
};

module.exports = {
  createToken,
  validateToken,
};
