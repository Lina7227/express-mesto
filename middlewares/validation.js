const { celebrate, Joi } = require('celebrate');
const {
  invalidName,
  invalidAbout,
  invalidLink,
  invalidId,
  notMatchdMail,
  notMAtchPassword,
  invalidAuth,
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

const validatyId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
      .alphanum()
      .error(new Joi.ValidationError(invalidId)),
  }).unknown(true),
});

const validatyCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .error(new Joi.ValidationError(invalidName)),
    link: Joi.string().pattern(link).required()
      .error(new Joi.ValidationError(invalidLink)),
  }).unknown(true),
});

const validatySigUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .error(new Joi.ValidationError(invalidName)),
    about: Joi.string().min(2).max(30)
      .error(new Joi.ValidationError(invalidAbout)),
    avatar: Joi.string().pattern(link)
      .error(new Joi.ValidationError(invalidLink)),
    email: Joi.string().required().email()
      .error(new Joi.ValidationError(notMatchdMail)),
    password: Joi.string().required().min(8)
      .error(new Joi.ValidationError(notMAtchPassword)),
  }).unknown(true),
});

const validatySigIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .error(new Joi.ValidationError(invalidAuth)),
    password: Joi.string().required().min(8)
      .error(new Joi.ValidationError(invalidAuth)),
  }).unknown(true),
});

module.exports = {
  validatyUser,
  validatyAvatar,
  validatyId,
  validatyCard,
  validatySigUp,
  validatySigIn,
};
