// src/components/ProfileCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./ProfileCard.css";

function ProfileCard({ user }) {
  return (
    <div className="profile-card">
      {user.profilePic ? (
        <img src={user.profilePic} alt="profile" className="profile-pic" />
      ) : (
        <div className="profile-initials">
          {user.userName.charAt(0).toUpperCase()}
        </div>
      )}
      <h4>{user.userName}</h4>
      <p>{user.email}</p>
      <Link to="/edit-profile" className="edit-link">Edit Profile</Link>
    </div>
  );
}

export default ProfileCard;