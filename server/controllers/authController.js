const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  // Check if the input is empty
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please Add all the feilds");
  }

  // Check if the User exists
  const exitsUser = await User.findOne({ email });
  if (exitsUser) {
    res.status(400);
    throw new Error("User already exits!!");
  }

  // Hashing Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Creating new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  // save user and return response
  if (newUser) {
    const user = await newUser.save();
    res.status(200).json(user);
  } else {
    res.status(400);
    throw new Error("Somthing went wrong!!");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Checking user exits
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("Wrong credentials");
  }

  // Password Validation
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    res.status(404);
    throw new Error("Wrong credentials");
  }
  res.status(200).json(user);
});

module.exports = { registerUser, loginUser };
