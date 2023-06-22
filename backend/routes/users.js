const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { login } = require('../controllers/login')
const { auth } = require('../middlewares/auth')

const {
  getAllUsers, getUser, getCurrentUser, updateUser, updateAvatar, createUser,
} = require('../controllers/users');

const users = express.Router();

users.get('/users', auth, getAllUsers);
users.get('/users/me', auth, getCurrentUser);
users.get(
  '/users/:userId', auth,
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().required().length(24),
    }),
  }),
  getUser,
);

users.patch(
  '/users/me', auth,
  celebrate({
    body: Joi.object().required().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

users.patch(
  '/users/me/avatar', auth,
  celebrate({
    body: Joi.object().required().keys({
      avatar: Joi.string().required().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    }),
  }),
  updateAvatar,
);

users.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

users.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    }),
  }),
  createUser,
);

module.exports = users;
