import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { authFetch } from "../utils/authFetch";
import "./PostCard.css";

const API = "https://localhost:7276";

function PostCard({ post, onDelete, onUpdate }) {
  const { user } = useContext(UserContext);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isOwner = user?.userName === post.userName;
  const hasLiked = post.likes?.includes(user?.userName);

  const handleLike = async () => {
    const res = await authFetch(`${API}/api/posts/${post.id}/like`, {
      method: "POST",
    });
    if (res.ok) {
      const updated = await res.json();
      onUpdate(updated);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    const res = await authFetch(`${API}/api/posts/${post.id}/comment`, {
      method: "POST",
      body: JSON.stringify({ text: commentText }),
    });
    if (res.ok) {
      const updated = await res.json();
      onUpdate(updated);
      setCommentText("");
    }
  };

  const handleDelete = async () => {
    const res = await authFetch(`${API}/api/posts/${post.id}`, {
      method: "DELETE",
    });
    if (res.ok) onDelete(post.id);
  };

  // Format date nicely
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-avatar">
          {post.userName.charAt(0).toUpperCase()}
        </div>
        <div className="post-meta">
          <span className="post-author">{post.userName}</span>
          <span className="post-date">{formatDate(post.createdAt)}</span>
        </div>
        {isOwner && (
          <button className="delete-btn" onClick={handleDelete} title="Delete post">
            <i className="fi fi-rr-trash"></i>

          </button>
        )}
      </div>

      {/* Content */}
      <p className="post-content">{post.content}</p>

      {/* Actions */}
      <div className="post-actions">
        <button
          className={`action-btn ${hasLiked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <i className={`fi ${hasLiked ? "fi-sr-heart" : "fi-rr-heart"}`}></i> {post.likes?.length || 0}
        </button>
        <button
          className="action-btn"
          onClick={() => setShowComments((v) => !v)}
        >
          <i className="fi fi-rr-comment"></i> {post.comments?.length || 0}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="comments-section">
          {post.comments?.map((c, i) => (
            <div key={i} className="comment">
              <span className="comment-author">{c.userName}</span>
              <span className="comment-text">{c.text}</span>
            </div>
          ))}

          <div className="comment-input-row">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              className="comment-input"
            />
            <button className="comment-submit" onClick={handleComment}>
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;