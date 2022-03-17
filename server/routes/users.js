const router = require("express").Router();
const {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser,
} = require("../controllers/userController");

// Update User
router.put("/:id", updateUser);
// Delete User
router.delete("/:id", deleteUser);
// get a User
router.get("/:id", getUser);
// follow a User
router.put("/:id/follow", followUser);
// Unfollow a User
router.put("/:id/unfollow", unfollowUser);

module.exports = router;
