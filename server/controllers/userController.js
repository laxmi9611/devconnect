const User = require("../models/User");
const Post = require("../models/Post");
const Follow = require("../models/Follow");
const cloudinary = require("../utils/cloudinary");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const [posts, followers, following] = await Promise.all([
  Post.find({ author: user._id })
    .populate("author", "name username avatar")
    .sort({ createdAt: -1 }),
  Follow.countDocuments({ following: user._id }),
  Follow.countDocuments({ follower: user._id }),
]);

    res.json({ user, posts, followers, following });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, skills, githubUsername, location, website } = req.body;

    const update = { name, bio, githubUsername, location, website };
    if (skills) update.skills = skills;

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "devconnect/avatars", transformation: [{ width: 400, height: 400, crop: "fill" }] },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSuggestedUsers = async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.user._id }).distinct("following");
    const users = await User.find({
      _id: { $nin: [req.user._id, ...following] },
    })
      .select("-password")
      .limit(5);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};