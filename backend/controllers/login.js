const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

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
      'secretkey',
      {
        expiresIn: '7d',
      },
    );

    res.send({ jwt: token });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };