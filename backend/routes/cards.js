const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth')
const {
  getAllCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cards');

const cards = express.Router();

cards.get('/cards', auth, getAllCards);

cards.post(
  '/cards', auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    }),
  }),
  createCard,
);

cards.delete(
  '/cards/:cardId', auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  deleteCard,
);

cards.put(
  '/cards/:cardId/likes', auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  putLike,
);

cards.delete(
  '/cards/:cardId/likes', auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  deleteLike,
);


module.exports = cards;