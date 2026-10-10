import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    bio: "",
    skills: "",
    githubUsername: "",
    location: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setForm({
          name: data.name || "",
          bio: data.bio || "",
          skills: (data.skills || []).join(", "),
          githubUsername: data.githubUsername || "",
          location: data.location || "",
          website: data.website || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchMe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const { data } = await API.put("/users", payload);
      updateUser(data);
      navigate(`/profile/${user.username}`);
    } catch (err) {
      alert("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Edit Profile</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Name</label>
        <input
          style={styles.input}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label style={styles.label}>Bio</label>
        <textarea
          style={styles.textarea}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          maxLength={300}
        />

        <label style={styles.label}>Skills (comma separated)</label>
        <input
          style={styles.input}
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
          placeholder="React, Node.js, MongoDB"
        />

        <label style={styles.label}>GitHub Username</label>
        <input
          style={styles.input}
          value={form.githubUsername}
          onChange={(e) =>
            setForm({ ...form, githubUsername: e.target.value })
          }
          placeholder="e.g., laxmi9611"
        />

        <label style={styles.label}>Location</label>
        <input
          style={styles.input}
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <label style={styles.label}>Website</label>
        <input
          style={styles.input}
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: "600px", margin: "auto", padding: "1.5rem 1rem" },
  heading: { color: "#e6edf3", marginBottom: "1.5rem" },
  form: {
    background: "#161b22",
    border: "1px solid #21262d",
    borderRadius: "12px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  label: {
    color: "#8b949e",
    fontSize: "0.85rem",
    marginTop: "0.4rem",
  },
  input: {
    padding: "0.7rem",
    background: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: "8px",
    color: "#e6edf3",
    fontSize: "0.95rem",
    outline: "none",
  },
  textarea: {
    padding: "0.7rem",
    background: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: "8px",
    color: "#e6edf3",
    fontSize: "0.95rem",
    resize: "vertical",
    outline: "none",
  },
  button: {
    marginTop: "1rem",
    padding: "0.8rem",
    background: "linear-gradient(135deg, #0066ff, #0044cc)",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "600",
  },
};

export default EditProfile;