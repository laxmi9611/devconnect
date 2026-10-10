import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(post.likes?.includes(user?._id));

  const handleLike = async () => {
    try {
      const { data } = await API.post(`/posts/${post._id}/like`);
      setLikes(data.likes);
      setLiked(data.liked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/${post._id}`);
      onDelete(post._id);
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // Safe fallbacks
  const author = post.author || {};
  const authorName = author.name || "Unknown";
  const authorUsername = author.username || "unknown";
  const authorAvatar = author.avatar || "";
  const authorInitial = authorName[0]?.toUpperCase() || "?";

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <Link
          to={`/profile/${authorUsername}`}
          style={styles.authorLink}
        >
          {authorAvatar ? (
            <img src={authorAvatar} alt="" style={styles.avatar} />
          ) : (
            <div style={styles.avatarFallback}>{authorInitial}</div>
          )}
          <div>
            <div style={styles.authorName}>{authorName}</div>
            <div style={styles.authorUsername}>@{authorUsername}</div>
          </div>
        </Link>
        <span style={styles.time}>
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p style={styles.content}>{post.content}</p>

      {post.image && <img src={post.image} alt="" style={styles.postImage} />}

      {post.code && (
        <pre style={styles.code}>
          <code>{post.code}</code>
        </pre>
      )}

      {post.tags?.length > 0 && (
        <div style={styles.tags}>
          {post.tags.map((t, i) => (
            <span key={i} style={styles.tag}>#{t}</span>
          ))}
        </div>
      )}

      <div style={styles.footer}>
        <button
          onClick={handleLike}
          style={liked ? styles.likedBtn : styles.likeBtn}
        >
          {liked ? "❤️" : "🤍"} {likes}
        </button>
        <Link to={`/post/${post._id}`} style={styles.commentBtn}>
          💬 {post.commentCount || 0}
        </Link>
        {user?._id === author?._id && (
          <button onClick={handleDelete} style={styles.deleteBtn}>
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#161b22",
    border: "1px solid #21262d",
    borderRadius: "12px",
    padding: "1.2rem",
    marginBottom: "1rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.8rem",
  },
  authorLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    textDecoration: "none",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarFallback: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0066ff, #0044cc)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
  },
  authorName: { color: "#e6edf3", fontSize: "0.95rem", fontWeight: "600" },
  authorUsername: { color: "#8b949e", fontSize: "0.8rem" },
  time: { color: "#6e7681", fontSize: "0.8rem" },
  content: {
    color: "#c9d1d9",
    lineHeight: "1.5",
    marginBottom: "0.8rem",
    whiteSpace: "pre-wrap",
  },
  postImage: {
    width: "100%",
    borderRadius: "8px",
    marginBottom: "0.8rem",
    maxHeight: "400px",
    objectFit: "cover",
  },
  code: {
    background: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: "8px",
    padding: "1rem",
    color: "#7ee787",
    fontSize: "0.85rem",
    overflowX: "auto",
    marginBottom: "0.8rem",
    fontFamily: "Consolas, Monaco, monospace",
  },
  tags: {
    display: "flex",
    gap: "0.4rem",
    flexWrap: "wrap",
    marginBottom: "0.8rem",
  },
  tag: { color: "#58a6ff", fontSize: "0.85rem" },
  footer: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    paddingTop: "0.8rem",
    borderTop: "1px solid #21262d",
  },
  likeBtn: {
    background: "transparent",
    color: "#8b949e",
    fontSize: "0.9rem",
  },
  likedBtn: {
    background: "transparent",
    color: "#e63946",
    fontSize: "0.9rem",
  },
  commentBtn: {
    background: "transparent",
    color: "#8b949e",
    fontSize: "0.9rem",
    textDecoration: "none",
  },
  deleteBtn: {
    background: "transparent",
    color: "#e63946",
    fontSize: "0.9rem",
    marginLeft: "auto",
  },
};

export default PostCard;