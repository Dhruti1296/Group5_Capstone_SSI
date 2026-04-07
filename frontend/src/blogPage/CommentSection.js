// import React, { useState } from "react";

// import "../App.css";

// function CommentSection() {

//     const [comment, setComment] = useState("");

//     const [comments, setComments] = useState([]);

//     const addComment = (e) => {

//         e.preventDefault();

//         setComments([

//             ...comments,

//             comment

//         ]);

//         console.log("Send comment to backend:", comment);

//         setComment("");

//     };

//     return (

//         <div className="comment-box">

//             <form onSubmit={addComment}>

//                 <input

//                     className="form-control mb-2"

//                     placeholder="Write reply"

//                     value={comment}

//                     onChange={(e) => setComment(e.target.value)}

//                 />

//                 <button className="btn btn-secondary btn-sm">

//                     Reply

//                 </button>

//             </form>

//             {

//                 comments.map((c, index) => (

//                     <div key={index} className="comment-item">

//                         {c}

//                     </div>

//                 ))

//             }
//         </div>
//     );
// }

// export default CommentSection;


import React, { useEffect, useState, useCallback } from "react";
import { addCommentToPost, getCommentsByPostId, deleteComment, updateComment } from "../services/commentService";
import "../App.css";

function CommentSection({ postId }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loggedUser = localStorage.getItem("username") || "";

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCommentsByPostId(postId);
      const data = res.data;

      const arr =
        Array.isArray(data) ? data :
        Array.isArray(data?.$values) ? data.$values :
        Array.isArray(data?.data) ? data.data :
        [];

      setComments(arr);
    } catch (err) {
      console.error(err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) loadComments();
  }, [postId, loadComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const commentData = {
      text: commentText,
      author: loggedUser || "Current User"
    };

    try {
      setSubmitting(true);
      await addCommentToPost(postId, commentData);
      setCommentText("");
      await loadComments();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id || c._id || c.Id);
    setEditText(c.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (commentId) => {
    try {
      await updateComment(commentId, loggedUser, editText);
      cancelEdit();
      await loadComments();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data || "Failed to update comment");
    }
  };

  const removeComment = async (commentId) => {
    try {
      await deleteComment(commentId, loggedUser);
      await loadComments();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data || "Failed to delete comment");
    }
  };

  return (
    <div className="mt-3">
      <form onSubmit={handleAddComment} className="d-flex gap-2">
        <input
          className="form-control"
          placeholder="Write reply..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button className="btn btn-secondary" disabled={submitting}>
          {submitting ? "..." : "Reply"}
        </button>
      </form>

      <div className="mt-2">
        {loading && <p>Loading replies...</p>}

        {!loading && comments.length === 0 && (
          <p className="text-muted">No replies yet.</p>
        )}

        {!loading &&
          Array.isArray(comments) &&
          comments.map((c) => {
            const cId = c.id || c._id || c.Id;
            const canModify = loggedUser && c.author === loggedUser;

            return (
              <div key={cId} className="border rounded p-2 mb-2">
                <div className="d-flex justify-content-between align-items-start">
                  <div style={{ width: "100%" }}>
                    <strong>{c.author}:</strong>

                    {editingId === cId ? (
                      <>
                        <input
                          className="form-control mt-2"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="mt-2 d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => saveEdit(cId)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <span> {c.text}</span>
                    )}
                  </div>

                  {canModify && editingId !== cId && (
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => startEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeComment(cId)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default CommentSection;