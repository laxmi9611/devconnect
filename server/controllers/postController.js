const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const Follow = require("../models/Follow");
const cloudinary = require("../utils/cloudinary");

exports.createPost = async (req, res) => {
  try {
    const { content, code, codeLanguage, tags, image } = req.body;
    if (!content) return res.status(400).json({ message: "Content required" });

    const post = await Post.create({
      author: req.user._id,
      content,
      code: code || "",
      codeLanguage: codeLanguage || "",
      tags: tags || [],
      image: image || "",
    });

    const populated = await Post.findById(post._id).populate("author", "name username avatar");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadPostImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "devconnect/posts", transformation: [{ width: 1200, quality: "auto" }] },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.user._id }).distinct("following");
    const postAuthors = [req.user._id, ...following];

    const posts = await Post.find({ author: { $in: postAuthors } })
      .populate("author", "name username avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExplore = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name username avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name username avatar");
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await Comment.find({ post: post._id })
      .populate("author", "name username avatar")
      .sort({ createdAt: 1 });

    res.json({ post, comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const hasLiked = post.likes.includes(req.user._id);

    if (hasLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);

      if (post.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: "like",
          post: post._id,
        });
      }
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !hasLiked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "name username avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};