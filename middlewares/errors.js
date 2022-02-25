const { ErrorCelebrate } = require('celebrate');
const BadRequest = require('../errors/BadRequest');

// eslint-disable-next-line consistent-return
const errors = (err, req, res, next) => {
  if (ErrorCelebrate(err)) {
    if (!err.details.get('body')) {
      return res(new BadRequest({ message: err.details.get('params').message }));
    }
    res(new BadRequest({ message: err.details.get('body').message }));
  } else {
    const { statusCode = 500, message } = err;

    res.status(statusCode).send({
      message: statusCode === 500 ? 'Ошибка сервера' : message,
    });
  }
  next();
};

module.exports = {
  errors,
};
