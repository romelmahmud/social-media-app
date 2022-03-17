const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const User = require("../models/User");

// create a post
const createPost = asyncHandler(async (req, res) => {
  const newPost = await new Post(req.body);
  const savedPost = await newPost.save();
  res.status(200).json(savedPost);
});
// updated a post
const updatePost = asyncHandler(async (req, res) => {
  // find post
  const post = await Post.findById(req.params.id);

  // checking the post author or Admin
  if (post.userId === req.body.userId) {
    await post.updateOne({ $set: req.body });

    res.status(200).json(post);
  } else {
    res.status(403);
    throw new Error("Only Author of this post can undated this post");
  }
});
// delete a post

const deletePost = asyncHandler(async (req, res) => {
  // find post
  const post = await Post.findById(req.params.id);

  // checking the post author or Admin
  if (post.userId === req.body.userId) {
    await post.deleteOne();

    res.status(200).json("post succesfully deleted");
  } else {
    res.status(403);
    throw new Error("Only Author of this post can delete this post");
  }
});
// like/Dislike a post
const likePost = asyncHandler(async (req, res) => {
  // find post
  const post = await Post.findById(req.params.id);

  if (!post.likes.includes(req.body.userId)) {
    await post.updateOne({ $push: { likes: req.body.userId } });
    res.status(200).json("post liked");
  } else {
    await post.updateOne({ $pull: { likes: req.body.userId } });
    res.status(200).json("post disliked");
  }
});

// get a post
const getPost = asyncHandler(async (req, res) => {
  // find post
  const post = await Post.findById(req.params.id);
  res.status(200).json(post);
});

// get timeline posts
const getTimelinePost = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.body.userId);
  const userPosts = await Post.find({ userId: currentUser._id });
  const friendPosts = await Promise.all(
    currentUser.following.map((friendId) => {
      return Post.find({ userId: friendId });
    })
  );
  res.json(userPosts.concat(...friendPosts));
});

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPost,
  getTimelinePost,
};
