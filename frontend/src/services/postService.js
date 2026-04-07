import api from "./api";

// retrieving all the posts from the db...
export const getAllPosts = () => api.get("/api/posts");

// for creating a new post...
export const createPost = (postData) => api.post("/api/posts", postData);

// deletion of the post by postID iff, its the logged in user post...
export const deletePost = (postId, author) =>
  api.delete(`/api/posts/${postId}?author=${encodeURIComponent(author)}`);