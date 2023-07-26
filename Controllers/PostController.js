const { default: mongoose } = require("mongoose");
const PostModel = require("../Models/PostModel");
const UserModel = require("../Models/UserModel");

const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);
  try {
    await newPost.save();
    return res.status(200).json({ msg: "Success", post: newPost });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await PostModel.findById(id);
    return res.status(200).json({ msg: "Success", post: post });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      return res.status(200).json({ msg: "Post updated" });
    } else {
      res.status(403).json({ msg: "Action forbidden" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(id);
    if (userId === post.userId) {
      await post.deleteOne();
      return res.status(200).json({ msg: "Post deleted successfully" });
    } else {
      return res.status(403).json({ msg: "Action forbidden" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      return res.status(200).json({ msg: "post liked" });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      return res.status(200).json({ msg: "post unLiked" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);
    return res.status(200).json({
      msg: "success",
      posts: [...currentUserPosts, ...followingPosts[0].followingPosts].sort(
        (a, b) => {
          return b.createdAt - a.createdAt;
        }
      ),
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getTimelinePosts,
};
