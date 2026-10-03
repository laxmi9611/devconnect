const axios = require("axios");

exports.getUserRepos = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) return res.status(400).json({ message: "Username required" });

    const headers = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const { data } = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`,
      { headers }
    );

    const repos = data.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      updatedAt: r.updated_at,
    }));

    res.json(repos);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ message: "GitHub user not found" });
    }
    res.status(500).json({ message: "Failed to fetch repos" });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const { username } = req.params;
    const headers = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const { data } = await axios.get(`https://api.github.com/users/${username}`, { headers });

    res.json({
      avatar: data.avatar_url,
      name: data.name,
      bio: data.bio,
      publicRepos: data.public_repos,
      followers: data.followers,
      following: data.following,
      location: data.location,
      blog: data.blog,
      joinedAt: data.created_at,
    });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ message: "GitHub user not found" });
    }
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};