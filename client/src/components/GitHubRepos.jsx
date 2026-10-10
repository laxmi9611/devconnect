import { useEffect, useState } from "react";
import API from "../services/api";

const GitHubRepos = ({ username }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const { data } = await API.get(`/github/repos/${username}`);
        setRepos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchRepos();
  }, [username]);

  if (!username) return null;
  if (loading) return <p style={styles.loading}>Loading repos...</p>;
  if (repos.length === 0)
    return <p style={styles.loading}>No public repos found</p>;

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>📦 GitHub Repos</h3>
      <div style={styles.grid}>
        {repos.slice(0, 6).map((repo) => (
          <a
            key={repo.id}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.repoCard}
          >
            <h4 style={styles.repoName}>{repo.name}</h4>
            {repo.description && (
              <p style={styles.repoDesc}>
                {repo.description.slice(0, 80)}
              </p>
            )}
            <div style={styles.repoMeta}>
              {repo.language && <span>🔵 {repo.language}</span>}
              <span>⭐ {repo.stars}</span>
              <span>🍴 {repo.forks}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { marginTop: "2rem" },
  heading: { color: "#e6edf3", marginBottom: "1rem", fontSize: "1.1rem" },
  loading: { color: "#8b949e", fontSize: "0.9rem", padding: "1rem 0" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "0.8rem",
  },
  repoCard: {
    display: "block",
    padding: "1rem",
    background: "#161b22",
    border: "1px solid #21262d",
    borderRadius: "10px",
    textDecoration: "none",
    transition: "border-color 0.2s",
  },
  repoName: {
    color: "#58a6ff",
    fontSize: "0.95rem",
    marginBottom: "0.4rem",
  },
  repoDesc: {
    color: "#8b949e",
    fontSize: "0.8rem",
    marginBottom: "0.6rem",
    lineHeight: "1.4",
  },
  repoMeta: {
    display: "flex",
    gap: "0.8rem",
    fontSize: "0.75rem",
    color: "#8b949e",
  },
};

export default GitHubRepos;