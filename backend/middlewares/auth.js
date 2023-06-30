const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const { NODE_ENV, SECRET_KEY } = process.env;
console.log(NODE_ENV);

function auth(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError(
        'Для выполнения действия необходима авторизация',
      );
    }

    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET_KEY : 'secretkey');
    } catch (err) {
      const errorAuth = new UnauthorizedError(
        'Для выполнения действия необходима авторизация',
      );
      next(errorAuth);
      return
    }

    req.user = payload;
    next();
  } catch (err) {
    const unauthorizedError = new UnauthorizedError(
      'Для выполнения действия необходима авторизация',
    );
    next(unauthorizedError);
  }
}

module.exports = { auth };