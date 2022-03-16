const User = require("../models/User");
const asyncHandler = require("express-async-handler");

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

  const newUser = new User({
    username,
    email,
    password,
  });

  if (newUser) {
    const user = await newUser.save();
    res.status(200).json(user);
  } else {
    res.status(400);
    throw new Error("Somthing went wrong!!");
  }
});

module.exports = { registerUser };
