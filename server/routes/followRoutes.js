const express = require("express");
const router = express.Router();
const {
  toggleFollow,
  getFollowers,
  getFollowing,
  checkFollow,
} = require("../controllers/followController");
const { protect } = require("../middleware/authMiddleware");

router.post("/:userId", protect, toggleFollow);
router.get("/:userId/followers", protect, getFollowers);
router.get("/:userId/following", protect, getFollowing);
router.get("/:userId/check", protect, checkFollow);

module.exports = router;