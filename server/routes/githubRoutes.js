const express = require("express");
const router = express.Router();
const { getUserRepos, getUserStats } = require("../controllers/githubController");
const { protect } = require("../middleware/authMiddleware");

router.get("/repos/:username", protect, getUserRepos);
router.get("/stats/:username", protect, getUserStats);

module.exports = router;