const Card = require('../models/card');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');

async function getAllCards(req, res, next) {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
}

async function createCard(req, res, next) {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.status(201).send(card);
  } catch (err) {
    next(err);
  }
}

async function deleteCard(req, res, next) {

  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).populate('owner');

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    const ownerId = card.owner.id;
    const userId = req.user._id;

    if (ownerId !== userId) {
      throw new ForbiddenError('Нельзя удалить чужую карточку');
    }

    await card.deleteOne();
    res.send(card);
  } catch (err) {
    next(err);
  }
}

async function putLike(req, res, next) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
}

async function deleteLike(req, res, next) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } }, // убрать _id из массива, если он есть
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllCards, createCard, deleteCard, putLike, deleteLike,
};
