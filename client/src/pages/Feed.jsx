import { useEffect, useState } from "react";
import API from "../services/api";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const { data } = await API.get("/posts/feed");
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleCreated = (post) => {
    setPosts([post, ...posts]);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((p) => p._id !== id));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🏠 Your Feed</h1>
      <CreatePost onCreated={handleCreated} />

      {loading ? (
        <p style={styles.loading}>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p style={styles.empty}>
          No posts yet. Follow developers to see their posts! 👥
        </p>
      ) : (
        posts.map((p) => (
          <PostCard key={p._id} post={p} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "700px", margin: "auto", padding: "1.5rem 1rem" },
  heading: { color: "#e6edf3", marginBottom: "1.5rem", fontSize: "1.4rem" },
  loading: { color: "#8b949e", textAlign: "center", padding: "3rem" },
  empty: {
    color: "#8b949e",
    textAlign: "center",
    padding: "3rem",
    background: "#161b22",
    border: "1px dashed #21262d",
    borderRadius: "12px",
  },
};

export default Feed;