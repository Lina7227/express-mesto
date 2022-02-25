const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const ConflictingPrompt = require('../errors/ConflictingPrompt');
const Unauthorized = require('../errors/Unauthorized ');
const {
  invalidLink,
  invalidAuth,
  notFoundUserId,
  incorrectData,
  userAlreadyBe,
  userNotAuthorized,
} = require('../errors/errorMessages');

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
        next(new NotFound(notFoundUserId));
      } else if (err.user === 'CastError') {
        next(new BadRequest(incorrectData));
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.message === 'NotValidId') {
        next(new NotFound(notFoundUserId));
      } else if (err.user === 'CastError') {
        next(new BadRequest(incorrectData));
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
    .then((({ _id }) => User.findById(_id)))
    .then((user) => {
      res.send(user.toJSON());
    })
    .catch((err) => {
      if (err.message === 'ValidationError') {
        throw new BadRequest(incorrectData);
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictingPrompt(userAlreadyBe);
      }
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { id } = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true, upsert: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFound(notFoundUserId));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest(userAlreadyBe));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { id } = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true, upsert: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFound(notFoundUserId));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest(invalidLink));
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
        next(new NotFound(invalidAuth));
      } else if (err) {
        next(new Unauthorized(userNotAuthorized));
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
