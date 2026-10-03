const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createPost,
  getFeed,
  getExplore,
  getPostById,
  likePost,
  deletePost,
  getUserPosts,
  uploadPostImage,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/feed", protect, getFeed);
router.get("/explore", protect, getExplore);
router.post("/", protect, createPost);
router.post("/upload", protect, upload.single("image"), uploadPostImage);
router.get("/user/:userId", protect, getUserPosts);
router.get("/:id", protect, getPostById);
router.post("/:id/like", protect, likePost);
router.delete("/:id", protect, deletePost);

module.exports = router;