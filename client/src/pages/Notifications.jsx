import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/notifications");
        setNotifications(data);
        await API.put("/notifications/read");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getMessage = (n) => {
    switch (n.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "started following you";
      default:
        return "did something";
    }
  };

  if (loading) return <p style={styles.loading}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <p style={styles.empty}>No notifications yet</p>
      ) : (
        notifications.map((n) => (
          <Link
            key={n._id}
            to={n.post ? `/post/${n.post._id}` : `/profile/${n.sender.username}`}
            style={styles.item}
          >
            {n.sender.avatar ? (
              <img src={n.sender.avatar} alt="" style={styles.avatar} />
            ) : (
              <div style={styles.avatarFallback}>{n.sender.name[0]}</div>
            )}
            <div style={styles.text}>
              <strong>{n.sender.name}</strong> {getMessage(n)}
              <div style={styles.time}>
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "700px", margin: "auto", padding: "1.5rem 1rem" },
  heading: { color: "#e6edf3", marginBottom: "1.5rem" },
  loading: { textAlign: "center", padding: "3rem", color: "#8b949e" },
  empty: { color: "#8b949e", textAlign: "center", padding: "3rem" },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    padding: "1rem",
    background: "#161b22",
    border: "1px solid #21262d",
    borderRadius: "10px",
    marginBottom: "0.6rem",
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
  text: { flex: 1, color: "#c9d1d9", fontSize: "0.9rem" },
  time: { color: "#6e7681", fontSize: "0.75rem", marginTop: "0.2rem" },
};

export default Notifications;