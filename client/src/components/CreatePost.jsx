import { useState } from "react";
import API from "../services/api";

const CreatePost = ({ onCreated }) => {
  const [content, setContent] = useState("");
  const [code, setCode] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("");
  const [tags, setTags] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const { data } = await API.post("/posts", {
        content,
        code,
        codeLanguage,
        tags: tags
          ? tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      });

      onCreated(data);
      setContent("");
      setCode("");
      setCodeLanguage("");
      setTags("");
      setShowCode(false);
    } catch (err) {
      alert("Failed to create post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <textarea
        style={styles.textarea}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        required
      />

      {showCode && (
        <>
          <select
            style={styles.input}
            value={codeLanguage}
            onChange={(e) => setCodeLanguage(e.target.value)}
          >
            <option value="">Select language...</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          <textarea
            style={styles.codeArea}
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={5}
          />
        </>
      )}

      <input
        style={styles.input}
        placeholder="Tags (comma separated, e.g., react, javascript)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <div style={styles.actions}>
        <button
          type="button"
          onClick={() => setShowCode(!showCode)}
          style={styles.toggleBtn}
        >
          {showCode ? "Hide Code" : "</> Add Code"}
        </button>
        <button type="submit" style={styles.postBtn} disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    background: "#161b22",
    border: "1px solid #21262d",
    borderRadius: "12px",
    padding: "1.2rem",
    marginBottom: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  textarea: {
    padding: "0.8rem",
    background: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: "8px",
    color: "#e6edf3",
    fontSize: "0.95rem",
    resize: "vertical",
    outline: "none",
  },
  codeArea: {
    padding: "0.8rem",
    background: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: "8px",
    color: "#7ee787",
    fontSize: "0.85rem",
    resize: "vertical",
    fontFamily: "Consolas, Monaco, monospace",
    outline: "none",
  },
  input: {
    padding: "0.7rem",
    background: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: "8px",
    color: "#e6edf3",
    fontSize: "0.9rem",
    outline: "none",
  },
  actions: { display: "flex", gap: "0.6rem", justifyContent: "flex-end" },
  toggleBtn: {
    padding: "0.6rem 1rem",
    background: "#21262d",
    color: "#c9d1d9",
    borderRadius: "8px",
    fontSize: "0.85rem",
  },
  postBtn: {
    padding: "0.6rem 1.5rem",
    background: "linear-gradient(135deg, #0066ff, #0044cc)",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "600",
  },
};

export default CreatePost;