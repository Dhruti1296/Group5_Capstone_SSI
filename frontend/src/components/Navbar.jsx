import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(UserContext);

  const initials = user?.userName
    ? user.userName.charAt(0).toUpperCase()
    : "G"; // fallback for Guest

  return (
    <>
      <div className="navbar-corner">
        {/* Logo on the left */}
        <Link to="/" className="logo">
          <img src="/images/conestoga-logo.png" alt="Conestoga Logo" />
        </Link>

        {/* Controls on the right */}
        <div className="corner-controls">
          <div className="welcome-box">
            <div className="profile-circle">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="profile" />
              ) : (
                initials
              )}
            </div>
            <span>Welcome, {user?.userName || "Guest"}</span>
          </div>

          <button className="menu-button" onClick={() => setMenuOpen(true)}>
            Menu
          </button>
        </div>
      </div>

      {/* Overlay Menu */}
      {menuOpen && (
        <div className="menu-overlay">
          <div className="menu-card drop-in">
            <button className="close-button" onClick={() => setMenuOpen(false)}>✕</button>
            <ul className="menu-links">
              <li><Link to="/dashboard">Home</Link></li>
              <li><Link to="/stories">Stories</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/alumni">Alumni</Link></li>
              <li><Link to="/volunteer">Volunteer</Link></li>
              <li><Link to="/mentor">Mentor</Link></li>
              <li><Link to="/edit-profile">Edit Profile</Link></li>
              <li><Link to="/logout">Logout</Link></li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;