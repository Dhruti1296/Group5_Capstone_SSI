import api from "./api";

// retrieving all the comments based on the specfic postId...
export const getCommentsByPostId = (postId) =>
  api.get(`/api/posts/${postId}/comments`);

// adding a new comment to a specific post...
export const addCommentToPost = (postId, commentData) =>
  api.post(`/api/posts/${postId}/comments`, commentData);

// updating the user posted comments of a specific post ...
export const updateComment = (commentId, author, newText) =>
  api.put(`/api/comments/${commentId}?author=${encodeURIComponent(author)}`, newText, {
    headers: { "Content-Type": "application/json" },
  });

// deleting the user posted comments of a specific post ...
export const deleteComment = (commentId, author) =>
  api.delete(`/api/comments/${commentId}?author=${encodeURIComponent(author)}`);