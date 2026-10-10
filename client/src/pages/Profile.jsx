import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import GitHubRepos from "../components/GitHubRepos";

const Profile = () => {
  const { username } = useParams();
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: profileData } = await API.get(`/users/${username}`);
      setData(profileData);
      setFollowers(profileData.followers);
      setFollowing(profileData.following);

      if (me && profileData.user._id !== me._id) {
        const { data: check } = await API.get(
          `/follow/${profileData.user._id}/check`
        );
        setIsFollowing(check.following);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  const handleFollow = async () => {
    try {
      const { data: res } = await API.post(`/follow/${data.user._id}`);
      setIsFollowing(res.following);
      setFollowers((f) => (res.following ? f + 1 : f - 1));
    } catch (err) {
      alert("Failed to follow");
    }
  };

  const handleDeletePost = (id) => {
    setData({ ...data, posts: data.posts.filter((p) => p._id !== id) });
  };

  if (loading) return <p style={styles.loading}>Loading profile...</p>;
  if (!data) return <p style={styles.loading}>User not found</p>;

  const isMe = me?._id === data.user._id;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {data.user.avatar ? (
          <img src={data.user.avatar} alt="" style={styles.avatar} />
        ) : (
          <div style={styles.avatarFallback}>{data.user.name[0]}</div>
        )}

        <div style={styles.info}>
          <h1 style={styles.name}>{data.user.name}</h1>
          <p style={styles.username}>@{data.user.username}</p>
          {data.user.bio && <p style={styles.bio}>{data.user.bio}</p>}

          <div style={styles.stats}>
            <span><strong>{data.posts.length}</strong> Posts</span>
            <span><strong>{followers}</strong> Followers</span>
            <span><strong>{following}</strong> Following</span>
          </div>

          {data.user.githubUsername && (
            <p style={styles.github}>
              🐙 GitHub:{" "}
              <a
                href={`https://github.com/${data.user.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                {data.user.githubUsername}
              </a>
            </p>
          )}

          <div style={styles.actions}>
            {isMe ? (
              <button
                onClick={() => navigate("/edit-profile")}
                style={styles.editBtn}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <button
                onClick={handleFollow}
                style={isFollowing ? styles.followingBtn : styles.followBtn}
              >
                {isFollowing ? "✓ Following" : "+ Follow"}
              </button>
            )}
          </div>
        </div>
      </div>

      {data.user.githubUsername && (
        <GitHubRepos username={data.user.githubUsername} />
      )}

      <h2 style={styles.postsHeading}>📝 Posts ({data.posts.length})</h2>
      {data.posts.length === 0 ? (
        <p style={styles.empty}>No posts yet</p>
      ) : (
        data.posts.map((p) => (
          <PostCard key={p._id} post={p} onDelete={handleDeletePost} />
        ))
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "700px", margin: "auto", padding: "1.5rem 1rem" },
  loading: { textAlign: "center", padding: "3rem", color: "#8b949e" },
  header: {
    display: "flex",
    gap: "1.5rem",
    padding: "1.5rem",
    background: "#161b22",
    border: "1px solid #21262d",
    borderRadius: "12px",
    marginBottom: "1.5rem",
    alignItems: "flex-start",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
  avatarFallback: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0066ff, #0044cc)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "2rem",
    flexShrink: 0,
  },
  info: { flex: 1 },
  name: { color: "#e6edf3", fontSize: "1.5rem", marginBottom: "0.2rem" },
  username: { color: "#8b949e", fontSize: "0.95rem", marginBottom: "0.8rem" },
  bio: {
    color: "#c9d1d9",
    fontSize: "0.9rem",
    marginBottom: "1rem",
    lineHeight: "1.5",
  },
  stats: {
    display: "flex",
    gap: "1.5rem",
    color: "#8b949e",
    fontSize: "0.9rem",
    marginBottom: "1rem",
  },
  github: { color: "#8b949e", fontSize: "0.85rem", marginBottom: "1rem" },
  link: { color: "#58a6ff", textDecoration: "none" },
  actions: { display: "flex", gap: "0.5rem" },
  editBtn: {
    padding: "0.5rem 1rem",
    background: "#21262d",
    color: "#e6edf3",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  followBtn: {
    padding: "0.5rem 1.2rem",
    background: "linear-gradient(135deg, #0066ff, #0044cc)",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  followingBtn: {
    padding: "0.5rem 1.2rem",
    background: "#21262d",
    color: "#e6edf3",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  postsHeading: {
    color: "#e6edf3",
    fontSize: "1.1rem",
    marginBottom: "1rem",
    marginTop: "2rem",
  },
  empty: { color: "#8b949e", textAlign: "center", padding: "2rem" },
};

export default Profile;