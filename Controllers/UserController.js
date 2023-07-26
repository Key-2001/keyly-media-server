const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");

const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      return res.status(200).json({ msg: "Success", user: otherDetails });
    } else {
      return res.status(404).json({ msg: "User is not existed!" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body;
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json({ msg: "Success", user: user });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res
      .status(403)
      .json({ msg: "Access denied! you can only update your own profile" });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      return res.status(200).json({ msg: "User deleted successfully!" });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res
      .status(500)
      .json({ msg: "Access denied! you can only delete your own profile" });
  }
};

const followUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId } = req.body;

  if (currentUserId === id) {
    return res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);

      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $push: { followers: currentUserId } });
        await followingUser.updateOne({ $push: { following: id } });
        return res.status(200).json("User followed!");
      } else {
        return res.status(403).json({ msg: "User is already followed by you" });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }
};

const unFollowUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId } = req.body;

  if (currentUserId === id) {
    return res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);

      if (followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $pull: { followers: currentUserId } });
        await followingUser.updateOne({ $pull: { following: id } });
        return res.status(200).json("User unFollowed!");
      } else {
        return res.status(403).json({ msg: "User is not followed by you" });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unFollowUser,
};
