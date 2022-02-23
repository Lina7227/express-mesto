const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const ConflictingPrompt = require('../errors/ConflictingPrompt');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserId = async (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFound('Пользователь по указанному _id не найден'));
      } else if (err.user === 'CastError') {
        next(new BadRequest('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFound('Пользователь по указанному _id не найден'));
      } else if (err.user === 'CastError') {
        next(new BadRequest('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные.');
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictingPrompt('Пользователь с таким E-mail уже существует');
      }
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { id } = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFound('Пользователь по указанному _id не найден'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { id } = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFound('Пользователь по указанному _id не найден'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара.'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: '7d',
        httpOnly: true,
        sameSite: true,
      })
        .status(200).send({ jwt: token });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFound('Пользователь по указанному _id не найден'));
      }
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserId,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
};
