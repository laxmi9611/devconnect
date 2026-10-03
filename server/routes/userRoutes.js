const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getUserProfile,
  updateProfile,
  uploadAvatar,
  searchUsers,
  getSuggestedUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/search", protect, searchUsers);
router.get("/suggested", protect, getSuggestedUsers);
router.get("/:username", protect, getUserProfile);
router.put("/", protect, updateProfile);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);

module.exports = router;