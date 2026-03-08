// src/components/Feed.jsx
import React from "react";
import "./Feed.css";

function Feed() {
  const posts = [
    { id: 1, author: "Alice", text: "Excited for alumni meet!", img: null },
    { id: 2, author: "Bob", text: "Volunteering this weekend!", img: "https://via.placeholder.com/300" },
  ];

  return (
    <div className="feed">
      {posts.map(post => (
        <div key={post.id} className="feed-post">
          <h4>{post.author}</h4>
          <p>{post.text}</p>
          {post.img && <img src={post.img} alt="post" />}
        </div>
      ))}
    </div>
  );
}

export default Feed;