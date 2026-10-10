import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useSocket } from "../context/SocketContext";

const NotificationBell = () => {
  const [count, setCount] = useState(0);
  const { socket } = useSocket();

  const fetchCount = async () => {
    try {
      const { data } = await API.get("/notifications/unread");
      setCount(data.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("notification-received", () => {
      setCount((c) => c + 1);
    });
    return () => socket.off("notification-received");
  }, [socket]);

  return (
    <Link to="/notifications" style={styles.bell}>
      🔔
      {count > 0 && <span style={styles.badge}>{count}</span>}
    </Link>
  );
};

const styles = {
  bell: {
    position: "relative",
    fontSize: "1.3rem",
    textDecoration: "none",
    cursor: "pointer",
  },
  badge: {
    position: "absolute",
    top: "-4px",
    right: "-8px",
    background: "#e63946",
    color: "#fff",
    fontSize: "0.65rem",
    padding: "0.15rem 0.4rem",
    borderRadius: "10px",
    fontWeight: "600",
    minWidth: "18px",
    textAlign: "center",
  },
};

export default NotificationBell;