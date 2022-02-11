const User = require('../models/user');


const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: `Ошибка ${err}`}));
};

const getUserId = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Переданы некорректные данные!' });
      } else {
        res.status(500).send({ message: `Ошибка ${err}` });
      }
    });
};

const createUser = (req, res) => {

  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
      res.status(400).send({ message: 'Ошибка при создании пользователя' });
    } else {
      res.status(500).send({ message: `Ошибка ${err}` });
    }
  });
}

const updateUserInfo = (req, res) => {
  const { id } = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с таким id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'SomeErrorName' || err.name === 'CastError') {
        res.status(400).send({ message: 'Данные не корректны' });
      } else {
        res.status(500).send({ message: `Ошибка ${err}` });
      }
    });
}

const updateUserAvatar = (req, res) => {
  const { id } = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с таким Id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка! Не верная ссылка на аватар.' });
      } else {
        res.status(500).send({ message: `Ошибка ${err}` });
      }
    });
};


module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserInfo,
  updateUserAvatar
}