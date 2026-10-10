import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Join DevConnect</h1>
        <p style={styles.subtitle}>Create your developer profile</p>
        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          style={styles.input}
          placeholder="Username (unique)"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value.toLowerCase() })
          }
          required
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          minLength={6}
          required
        />
        <button type="submit" style={styles.button}>Create Account</button>

        <p style={styles.text}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "calc(100vh - 65px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  form: {
    background: "#161b22",
    border: "1px solid #21262d",
    padding: "2.5rem",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  title: { textAlign: "center", color: "#e6edf3" },
  subtitle: {
    textAlign: "center",
    color: "#8b949e",
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
  },
  input: {
    padding: "0.8rem 1rem",
    background: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: "8px",
    color: "#e6edf3",
    fontSize: "0.95rem",
    outline: "none",
  },
  button: {
    padding: "0.8rem",
    background: "linear-gradient(135deg, #0066ff, #0044cc)",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
  },
  error: {
    color: "#f85149",
    fontSize: "0.9rem",
    textAlign: "center",
    background: "#3d1418",
    padding: "0.6rem",
    borderRadius: "8px",
  },
  text: { textAlign: "center", color: "#8b949e", fontSize: "0.9rem" },
  link: { color: "#58a6ff", fontWeight: "600" },
};

export default Register;