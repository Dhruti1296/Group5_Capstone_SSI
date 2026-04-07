// import React, { useState } from "react";

// import CommentSection from "./CommentSection";
// import "../App.css";
// function PostList() {
//     const [posts] = useState([
//         {
//             id: 1,
//             title: "My SSI Experience",
//             content: "SSI helped me learn React.",
//             author: "Dhruti",
//             date: "Feb 2026"
//         }
//     ]);

//     return (
//         <div>
//             {posts.map(post => (
//                 <div key={post.id} className="card post-card p-3">
//                     <div className="post-title">
//                         {post.title}
//                     </div>
//                     <div className="post-meta">
//                         By {post.author} | {post.date}
//                     </div>
//                     <div className="post-content">
//                         {post.content}
//                     </div>
//                     <CommentSection />
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default PostList;

import React from "react";
import CommentSection from "./CommentSection";
import { deletePost } from "../services/postService";
import "../App.css";

function PostList({ posts, onPostDeleted }) {
  const safePosts = Array.isArray(posts) ? posts : [];
  const loggedUser = localStorage.getItem("username");

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId, loggedUser);
      alert("Post deleted successfully");
      if (onPostDeleted) onPostDeleted(); // reload posts
    } catch (err) {
      console.error(err);
      alert(err?.response?.data || "Failed to delete post");
    }
  };

  if (safePosts.length === 0) {
    return <p>No posts yet. Create one above!</p>;
  }

  return (
    <div>
      {safePosts.map((post) => {
        const postId = post.id || post._id || post.Id;
        const canDelete = loggedUser && post.author === loggedUser;

        return (
          <div key={postId} className="card p-3 mb-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-1">{post.title}</h5>
                <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                  By {post.author}{" "}
                  {post.createdAt ? ` | ${new Date(post.createdAt).toLocaleString()}` : ""}
                </div>
              </div>

              {canDelete && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(postId)}
                >
                  Delete
                </button>
              )}
            </div>

            <p className="mt-2">{post.content}</p>

            <CommentSection postId={postId} />
          </div>
        );
      })}
    </div>
  );
}

export default PostList;