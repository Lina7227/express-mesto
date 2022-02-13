const User = require('../models/user');

const ERROR_CODE = 400;
const ERROR_LACK = 404;
const ERROR_DEFAULT = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: `Ошибка по умолчанию.`}));
};

const getUserId = async (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_LACK).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.'}));
};

const createUser = (req, res) => {

  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя. ' });
    } else {
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    }
  });
}

const updateUserInfo = (req, res) => {
  const { id } = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_LACK).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'SomeErrorName' || err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
      }
    });
}

const updateUserAvatar = (req, res) => {
  const { id } = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_LACK).send({ message: 'Пользователь с таким id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
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