import { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";
import UserCard from "../components/UserCard";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes] = await Promise.all([
          API.get("/posts/explore"),
          API.get("/users/suggested"),
        ]);
        setPosts(postsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { data } = await API.get(`/users/search?q=${query}`);
        setSearchResults(data);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🔍 Explore</h1>

      <input
        style={styles.search}
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query && searchResults.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.subheading}>Users</h2>
          {searchResults.map((u) => (
            <UserCard key={u._id} user={u} />
          ))}
        </div>
      )}

      {!query && users.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.subheading}>👥 Suggested Developers</h2>
          {users.map((u) => (
            <UserCard key={u._id} user={u} />
          ))}
        </div>
      )}

      {!query && (
        <div style={styles.section}>
          <h2 style={styles.subheading}>📝 Recent Posts</h2>
          {posts.map((p) => (
            <PostCard
              key={p._id}
              post={p}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "700px", margin: "auto", padding: "1.5rem 1rem" },
  heading: { color: "#e6edf3", marginBottom: "1.5rem", fontSize: "1.4rem" },
  search: {
    width: "100%",
    padding: "0.8rem 1rem",
    background: "#161b22",
    border: "1px solid #21262d",
    borderRadius: "10px",
    color: "#e6edf3",
    fontSize: "0.95rem",
    marginBottom: "1.5rem",
    outline: "none",
  },
  section: { marginBottom: "2rem" },
  subheading: {
    color: "#e6edf3",
    fontSize: "1.1rem",
    marginBottom: "1rem",
  },
};

export default Explore;