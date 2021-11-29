const { jwt, errors } = require('../helpers');

module.exports = (req, _res, next) => {
  try {
    const { authorization: token } = req.headers;

    if (!token) return next(errors.missingToken);

    const decoded = jwt.validateToken(token);
    
    delete decoded.exp;
    delete decoded.iat;

    req.user = decoded;

    next();
  } catch (err) {
    if (err.message === 'jwt malformed') return next(errors.jwtMalformed);
    next(err);
  }
};
