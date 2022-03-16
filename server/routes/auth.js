const router = require("express").Router();
const { registerUser } = require("../controllers/authController");

// Register new User
router.post("/register", registerUser);

module.exports = router;
