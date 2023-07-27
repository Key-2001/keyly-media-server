const express = require("express");
const authMiddleware = require("../MiddleWare/authMiddleWare");
const {
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unFollowUser,
  getAllUser,
} = require("../Controllers/UserController");
const router = express.Router();

router.get("/", getAllUser);
router.get("/:id", getUser);
router.patch("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.patch("/:id/follow", authMiddleware, followUser);
router.patch("/:id/un-follow", authMiddleware, unFollowUser);

module.exports = router;
