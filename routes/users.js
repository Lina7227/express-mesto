const router = require('express').Router();
const {
  getUsers,
  getUserId,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');
const {
  validatyUser,
  validatyAvatar,
  validatyId,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validatyId, getUserId);
router.patch('/me', validatyUser, updateUserInfo);
router.patch('/me/avatar', validatyAvatar, updateUserAvatar);

module.exports = router;
