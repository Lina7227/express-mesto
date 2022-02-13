const Card = require('../models/card');

const ERROR_CODE = 400;
const ERROR_LACK = 404;
const ERROR_DEFAULT = 500;

const getCards = (req, res) => {
  Card.find({})
  .then((cards) => res.send(cards))
  .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' }));
}


const createCard = (req, res) => {

  const {name, link} = req.body;
  const ownerId = req.user._id;

  Card.create({name, link, owner: ownerId})
    .then((card) => res.status(200).send({data: card}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
      res.status(ERROR_CODE).send({ message: `Ошибка ${err}.  Переданы некорректные данные при создании карточки.` });
    } else {
      res.status(ERROR_DEFAULT).send({ message: `Ошибка ${err}` });
    }
  });
}

const deleteCard = (req, res) => {

  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(ERROR_LACK).send({message: 'Карточка с указанным _id не найдена.' })
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
    if (!card) {
      res.status(ERROR_LACK).send({ message: 'Передан несуществующий _id карточки.' });
    } else {
      res.send(card);
    }
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
      }
    });
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
    if (!card) {
      res.status(ERROR_LACK).send({ message: 'Передан несуществующий _id карточки.' });
      res.send(card);
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для снятии лайка.' });
    } else {
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    }
  });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}