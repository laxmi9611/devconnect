const Follow = require("../models/Follow");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const target = await User.findById(targetUserId);
    if (!target) return res.status(404).json({ message: "User not found" });

    const existing = await Follow.findOne({
      follower: req.user._id,
      following: targetUserId,
    });

    if (existing) {
      await existing.deleteOne();
      res.json({ following: false });
    } else {
      await Follow.create({ follower: req.user._id, following: targetUserId });

      await Notification.create({
        recipient: targetUserId,
        sender: req.user._id,
        type: "follow",
      });

      res.json({ following: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const follows = await Follow.find({ following: req.params.userId })
      .populate("follower", "name username avatar");
    res.json(follows.map((f) => f.follower));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const follows = await Follow.find({ follower: req.params.userId })
      .populate("following", "name username avatar");
    res.json(follows.map((f) => f.following));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkFollow = async (req, res) => {
  try {
    const existing = await Follow.findOne({
      follower: req.user._id,
      following: req.params.userId,
    });
    res.json({ following: !!existing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};