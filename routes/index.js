const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('./auth');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

router.use((req, res) => {
  res.status(404).send({ message: `По адресу ${req.path} ничего нет` });
});

module.exports = router;
