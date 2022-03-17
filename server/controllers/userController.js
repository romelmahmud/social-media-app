const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Update User
const updateUser = asyncHandler(async (req, res) => {
  // varify user
  const { userId } = req.body;

  if (userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });

    res.status(200).json("Account has been updated");
  } else {
    res.status(404);
    throw new Error("You can only update your account!");
  }
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  // varify user
  const { userId } = req.body;

  if (userId === req.params.id || req.body.isAdmin) {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json("Account has been Deleted");
  } else {
    res.status(404);
    throw new Error("You can only delete your account!");
  }
});

// Get user
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const { password, updatedAt, ...others } = user._doc;
  res.status(200).json(others);
});

// Follow user
const followUser = asyncHandler(async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (!user.followers.includes(req.body.userId)) {
      await user.updateOne({ $push: { followers: req.body.userId } });
      await currentUser.updateOne({ $push: { following: req.params.id } });
      res.status(200).json("user has been followed");
    } else {
      res.status(403);
      throw new Error("You allready follow this user");
    }
  } else {
    res.status(403);
    throw new Error("You can't follow yourself");
  }
});

// Unfollow user
const unfollowUser = asyncHandler(async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (user.followers.includes(req.body.userId)) {
      await user.updateOne({ $pull: { followers: req.body.userId } });
      await currentUser.updateOne({ $pull: { following: req.params.id } });
      res.status(200).json("user has been unfollowed");
    } else {
      res.status(403);
      throw new Error("There is somthing wrong");
    }
  } else {
    res.status(403);
    throw new Error("You can't unfollow yourself");
  }
});

module.exports = { updateUser, deleteUser, getUser, followUser, unfollowUser };
