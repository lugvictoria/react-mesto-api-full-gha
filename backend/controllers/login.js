const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const { NODE_ENV, SECRET_KEY } = process.env;

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedError('Неверные данные для входа');
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      NODE_ENV === 'production' ? SECRET_KEY : 'secretkey',
      {
        expiresIn: '7d',
      },
    );

    res.send({ token });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };