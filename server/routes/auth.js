const router = require("express").Router();
const { registerUser, loginUser } = require("../controllers/authController");

// Register new User
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

module.exports = router;
