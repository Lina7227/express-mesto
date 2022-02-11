const Card = require('../models/card');


const getCards = (req, res) => {
  Card.find({})
  .then((cards) => res.send(cards))
  .catch(() => res.status(500).send({ message: `Ошибка ${err}` }));
}


const createCard = (req, res) => {

  const {name, link} = req.body;

  Card.create({name, link, owner: req.user._id})
    .then((card) => res.status(200).send({data: card}))
    .catch((err) => {
      if (!name || !link) {
      res.status(400).send({ message: `Ошибка ${err}.  Обязательные поля не заполнены!` });
    } else {
      res.status(500).send({ message: `Ошибка ${err}` });
    }
  });
}

const deleteCard = (req, res) => {

  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(404).send({message: 'Карточка с таким id не существует!' })
      } else {
        res.send(card);
      }
    })
    .catch((err) => res.status(500).send({ message: `Ошибка ${err}` }));
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Карточка с таким Id не существует!' });
    } else {
      res.send(card);
    }
  })
    .catch((err) => res.status(500).send({ message: `Ошибка ${err}` }));
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Карточка с таким Id не существует!' });
      res.send(card);
    }
  })
    .catch((err) => res.status(500).send({ message: `Ошибка ${err}` }));
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}