// import React from "react";

// import CreatePost from "./CreatePost";

// import PostList from "./PostList";

// import "../App.css";

// function BlogPage() {

//     return (

//         <div className="container blog-container">

//             <h2>SSI Student & Alumni Stories</h2>

//             <CreatePost />

//             <PostList />

//         </div>

//     );

// }

// export default BlogPage;

import React, { useEffect, useState, useCallback } from "react";
import CreatePost from "./CreatePost";
import PostList from "./PostList";
import { getAllPosts } from "../services/postService";
import "../App.css";

function BlogPage() {
  const [posts, setPosts] = useState([]); // ✅ must be array
  const [loading, setLoading] = useState(false);

  // // ✅ normalize backend response to array
  // const normalizeToArray = (data) => {
  //   if (Array.isArray(data)) return data;
  //   if (Array.isArray(data?.$values)) return data.$values; // for some .NET serializers
  //   if (Array.isArray(data?.data)) return data.data;
  //   return [];
  // };

  const loadPosts = useCallback(async () => {
  try {
    setLoading(true);

    const res = await getAllPosts();

    const data = res.data;

    const postArray =
      Array.isArray(data) ? data :
      Array.isArray(data?.$values) ? data.$values :
      Array.isArray(data?.data) ? data.data :
      [];

    setPosts(postArray);
  } catch (err) {
    console.error(err);
    setPosts([]);
  } finally {
    setLoading(false);
  }
}, []);

 useEffect(() => {
  loadPosts();
}, [loadPosts]);

  return (
    <div className="container blog-container mt-4">
      <h2 className="mb-3">SSI Student & Alumni Stories</h2>

      <CreatePost onPostCreated={loadPosts} />

      {loading ? <p>Loading posts...</p> : <PostList posts={posts} onPostDeleted={loadPosts} />}
    </div>
  );
}

export default BlogPage;