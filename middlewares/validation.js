const { celebrate, Joi } = require('celebrate');
const {
  invalidName,
  invalidAbout,
  invalidLink,
} = require('../errors/errorMessages');

const link = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

const validatyUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .error(new Joi.ValidationError(invalidName)),
    about: Joi.string().min(2).max(30).required()
      .error(new Joi.ValidationError(invalidAbout)),
  }).unknown(true),
});

const validatyAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(link).required()
      .error(new Joi.ValidationError(invalidLink)),
  }).unknown(true),
});

module.exports = {
  validatyUser,
  validatyAvatar,
};
