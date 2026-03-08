import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Stories from "../components/Stories";
import AlumniList from "../components/AlumniList";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [postText, setPostText] = useState("");

  if (!user) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="welcome-banner">Loading your dashboard...</div>
        <Footer />
      </div>
    );
  }

  const handlePost = () => {
    console.log("New post:", postText);
    setPostText("");
    setShowModal(false);
    // TODO: send to backend
  };

  return (
    <div className="dashboard-page">
      <Navbar />

     {/* Post box trigger */}
<div className="post-box" onClick={() => setShowModal(true)}>
  <div className="post-box-inner">
    <div className="profile-circle">
      {user.profilePic ? (
        <img src={user.profilePic} alt="profile" />
      ) : (
        user.userName.charAt(0).toUpperCase()
      )}
    </div>
    <span>What’s on your mind, {user.userName}?</span>
  </div>
</div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Create Post</h3>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share your thoughts..."
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="post-btn" onClick={handlePost}>Post</button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-layout">
        {/* Column 1 */}
        <div className="dashboard-column profile-column">
          {/* Profile pic + links */}
         {user.profilePic ? (
  <img
    src={user.profilePic}
    alt="Profile"
    className="profile-pic"
  />
) : (
  <div className="profile-pic initials">
    {user.userName.charAt(0).toUpperCase()}
  </div>
)}
<h3 className="user-name">{user.userName}</h3>
          <nav className="profile-links">
            <a href="/stories">Stories</a>
            <a href="/news">News</a>
            <a href="/events">Events</a>
            <a href="/services">Student Services</a>
            <a href="/post-story">Post a Story</a>
            <a href="/get-involved">Get Involved</a>
          </nav>
        </div>

        {/* Column 2 */}
        <div className="dashboard-column feed-column">
          <Stories />
        </div>

        {/* Column 3 */}
        <div className="dashboard-column lists-column">
          
          <AlumniList />
          <h3>Students</h3>
          <a href="/students">View Students</a>
          <h3>Staff</h3>
          <a href="/staff">View Staff</a>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;