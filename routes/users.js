const router = require('express').Router();
const {
  getUsers,
  getUserId,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  // login,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.get('/me', getUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
