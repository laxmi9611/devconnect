import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🦊 DevConnect</Link>

      <div style={styles.center}>
        {user && (
          <>
            <Link to="/" style={styles.link}>Feed</Link>
            <Link to="/explore" style={styles.link}>Explore</Link>
            <Link to={`/profile/${user.username}`} style={styles.link}>
              Profile
            </Link>
          </>
        )}
      </div>

      <div style={styles.right}>
        {user ? (
          <>
            <NotificationBell />
            <Link to={`/profile/${user.username}`} style={styles.avatarLink}>
              {user.avatar ? (
                <img src={user.avatar} alt="me" style={styles.avatarImg} />
              ) : (
                <div style={styles.avatarInitial}>{user.name[0]}</div>
              )}
            </Link>
            <button onClick={handleLogout} style={styles.logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.8rem 2rem",
    background: "#0d1117",
    borderBottom: "1px solid #21262d",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: "#e6edf3",
    fontSize: "1.25rem",
    fontWeight: "bold",
    textDecoration: "none",
  },
  center: { display: "flex", gap: "1.5rem" },
  right: { display: "flex", alignItems: "center", gap: "1rem" },
  link: {
    color: "#8b949e",
    textDecoration: "none",
    fontSize: "0.9rem",
  },
  registerBtn: {
    padding: "0.5rem 1rem",
    background: "linear-gradient(135deg, #0066ff, #0044cc)",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  logout: {
    padding: "0.4rem 0.9rem",
    background: "#e63946",
    color: "#fff",
    borderRadius: "6px",
    fontSize: "0.8rem",
  },
  avatarLink: { display: "flex" },
  avatarImg: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #21262d",
  },
  avatarInitial: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#0066ff",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
};

export default Navbar;