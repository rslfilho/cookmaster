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
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    return err;
  }
};

module.exports = {
  createToken,
  validateToken,
};
