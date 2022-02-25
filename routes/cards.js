const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validatyId,
  validatyCard,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validatyCard, createCard);
router.delete('/:cardId', validatyId, deleteCard);
router.put('/:cardId/likes', validatyId, likeCard);
router.delete('/:cardId/likes', validatyId, dislikeCard);

module.exports = router;
