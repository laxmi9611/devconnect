import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import PostCard from "../components/PostCard";
import CommentList from "../components/CommentList";

const PostDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleCommentAdded = (c) => {
    setData((prev) => ({
      ...prev,
      comments: [...prev.comments, c],
      post: {
        ...prev.post,
        commentCount: (prev.post.commentCount || 0) + 1,
      },
    }));
  };

  const handleCommentDeleted = (id) => {
    setData((prev) => ({
      ...prev,
      comments: prev.comments.filter((c) => c._id !== id),
      post: {
        ...prev.post,
        commentCount: Math.max((prev.post.commentCount || 1) - 1, 0),
      },
    }));
  };

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (!data) return <p style={styles.loading}>Post not found</p>;

  return (
    <div style={styles.container}>
      <PostCard post={data.post} onDelete={() => {}} />
      <CommentList
        comments={data.comments}
        postId={data.post._id}
        onCommentAdded={handleCommentAdded}
        onCommentDeleted={handleCommentDeleted}
      />
    </div>
  );
};

const styles = {
  container: { maxWidth: "700px", margin: "auto", padding: "1.5rem 1rem" },
  loading: { textAlign: "center", padding: "3rem", color: "#8b949e" },
};

export default PostDetail;