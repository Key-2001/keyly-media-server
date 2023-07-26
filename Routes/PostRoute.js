const express = require("express");
const {
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getTimelinePosts,
} = require("../Controllers/PostController");
const router = express.Router();

router.post("/", createPost);
router.get("/:id", getPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/:id/like", likePost)
router.get("/:id/timeline", getTimelinePosts)
module.exports = router;
