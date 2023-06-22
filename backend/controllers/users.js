const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { NotFoundError } = require('../errors/NotFoundError');
const { ConflictError } = require('../errors/ConflictError');

const SALT_LENGTH = 10;

async function createUser(req, res, next) {
  try {
    const { email, password, name, about, avatar } = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_LENGTH);
    let user;

    try {
      user = await User.create({
        email,
        password: passwordHash,
        name,
        about,
        avatar,
      });
    } catch (err) {
      if (err.code === 11000) {
        const conflict = new ConflictError('Пользователь с таким email уже существует');
        next(conflict);
        return
      }
      next(err);
    }

    user = user.toObject();
    delete user.password;
    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    next(err);
  }
}

async function updateAvatar(req, res, next) {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllUsers, getUser, getCurrentUser, createUser, updateUser, updateAvatar,
};
