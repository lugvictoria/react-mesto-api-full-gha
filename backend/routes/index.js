const express = require('express');
const { NotFoundError } = require('../errors/NotFoundError');
const { auth } = require('../middlewares/auth');

const router = express.Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use(userRouter);
router.use(cardRouter);

router.use( auth, (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

module.exports = router;
