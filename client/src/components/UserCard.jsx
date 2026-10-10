import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
  return (
    <Link to={`/profile/${user.username}`} style={styles.link}>
      <div style={styles.card}>
        {user.avatar ? (
          <img src={user.avatar} alt="" style={styles.avatar} />
        ) : (
          <div style={styles.avatarFallback}>{user.name[0]}</div>
        )}
        <div style={styles.info}>
          <div style={styles.name}>{user.name}</div>
          <div style={styles.username}>@{user.username}</div>
          {user.bio && <p style={styles.bio}>{user.bio.slice(0, 60)}</p>}
        </div>
      </div>
    </Link>
  );
};

const styles = {
  link: { textDecoration: "none" },
  card: {
    display: "flex",
    gap: "0.8rem",
    padding: "0.8rem",
    background: "#161b22",
    border: "1px solid #21262d",
    borderRadius: "10px",
    marginBottom: "0.6rem",
    cursor: "pointer",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarFallback: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0066ff, #0044cc)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    flexShrink: 0,
  },
  info: { flex: 1, minWidth: 0 },
  name: { color: "#e6edf3", fontSize: "0.95rem", fontWeight: "600" },
  username: { color: "#8b949e", fontSize: "0.8rem", marginBottom: "0.2rem" },
  bio: {
    color: "#8b949e",
    fontSize: "0.8rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

export default UserCard;