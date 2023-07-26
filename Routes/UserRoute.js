const express = require('express');
const { getUser, updateUser, deleteUser, followUser, unFollowUser } = require('../Controllers/UserController');
const router = express.Router();

router.get('/:id',getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/follow', followUser)
router.patch('/:id/un-follow', unFollowUser)

module.exports = router;