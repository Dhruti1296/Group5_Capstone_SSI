// import React, { useState } from "react";

// import "../App.css";

// function CreatePost() {
//     const [title, setTitle] = useState("");
//     const [content, setContent] = useState("");
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const postData = {
//             title,
//             content,
//             author: "Current User",
//             date: new Date()
//         };
//         console.log("Send to backend:", postData);
//         setTitle("");
//         setContent("");
//     };

//     return (
//         <div className="card create-post-card p-3">
//             <h4>Create Story</h4>
//             <form onSubmit={handleSubmit}>
//                 <input className="form-control mb-2" placeholder="Enter Title" 
//                 value={title} onChange={(e) => setTitle(e.target.value)} required />

//                 <textarea
//                     className="form-control mb-2"
//                     placeholder="Write Story"
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     required
//                 />
//                 <button className="btn btn-primary">  Post </button>
//             </form>
//         </div>
//     );
// }

// export default CreatePost;


import React, { useState } from "react";
import { createPost } from "../services/postService";
import "../App.css";

function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title: title,
      content: content,
      author: localStorage.getItem("username") || "Current User"
    };

    try {
      setSubmitting(true);
      await createPost(postData); // axios POST
      alert("Post created successfully!");

      setTitle("");
      setContent("");

      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error("Create post error:", err);
      alert(err?.response?.data || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h4>Create Story</h4>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="form-control mb-2"
          placeholder="Write Story"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
        />

        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;