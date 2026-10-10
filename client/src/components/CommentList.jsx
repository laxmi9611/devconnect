import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const CommentList = ({ comments, postId, onCommentAdded, onCommentDeleted }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const { data } = await API.post(`/comments/post/${postId}`, { text });
      onCommentAdded(data);
      setText("");
    } catch (err) {
      alert("Failed to add comment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete comment?")) return;
    try {
      await API.delete(`/comments/${id}`);
      onCommentDeleted(id);
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>💬 Comments ({comments.length})</h3>

      <div style={styles.list}>
        {comments.length === 0 ? (
          <p style={styles.empty}>No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} style={styles.comment}>
              <Link
                to={`/profile/${c.author.username}`}
                style={styles.authorLink}
              >
                {c.author.avatar ? (
                  <img src={c.author.avatar} alt="" style={styles.avatar} />
                ) : (
                  <div style={styles.avatarFallback}>
                    {c.author.name[0]}
                  </div>
                )}
                <div>
                  <div style={styles.authorName}>{c.author.name}</div>
                  <div style={styles.time}>
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              </Link>
              <p style={styles.text}>{c.text}</p>
              {user?._id === c.author._id && (
                <button
                  onClick={() => handleDelete(c._id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" style={styles.btn}>Send</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    background: "#161b22",
    border: "1px solid #21262d",
    borderRadius: "12px",
    padding: "1.2rem",
    marginTop: "1rem",
  },
  heading: { color: "#e6edf3", marginBottom: "1rem", fontSize: "1rem" },
  list: { marginBottom: "1rem" },
  empty: {
    color: "#6e7681",
    fontSize: "0.85rem",
    fontStyle: "italic",
    padding: "0.5rem 0",
  },
  comment: {
    background: "#0d1117",
    padding: "0.8rem",
    borderRadius: "8px",
    marginBottom: "0.6rem",
    position: "relative",
  },
  authorLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
    marginBottom: "0.5rem",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarFallback: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0066ff, #0044cc)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "0.8rem",
  },
  authorName: { color: "#58a6ff", fontSize: "0.85rem", fontWeight: "600" },
  time: { color: "#6e7681", fontSize: "0.7rem" },
  text: { color: "#c9d1d9", fontSize: "0.9rem", lineHeight: "1.4" },
  deleteBtn: {
    position: "absolute",
    top: "0.8rem",
    right: "0.8rem",
    background: "transparent",
    color: "#e63946",
    fontSize: "0.75rem",
  },
  form: { display: "flex", gap: "0.5rem" },
  input: {
    flex: 1,
    padding: "0.6rem 0.8rem",
    background: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: "8px",
    color: "#e6edf3",
    fontSize: "0.9rem",
    outline: "none",
  },
  btn: {
    padding: "0.6rem 1rem",
    background: "#0066ff",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "600",
  },
};

export default CommentList;