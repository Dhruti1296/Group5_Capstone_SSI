import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { authFetch } from "../utils/authFetch";
import "./Navbar.css";

const API = "http://localhost:5277";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, logout } = useContext(UserContext);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const initials = user?.userName
    ? user.userName.charAt(0).toUpperCase()
    : "G";

  useEffect(() => {
    if (!user || user.role === "Admin") return;

    const fetchNotifications = async () => {
      try {
        const res = await authFetch(`${API}/api/notifications`);
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
          setUnreadCount(data.filter((n) => !n.isRead).length);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    await authFetch(`${API}/api/notifications/mark-all-read`, { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      await authFetch(`${API}/api/notifications/${notif.id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => n.id === notif.id ? { ...n, isRead: true } : n)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/login");
  };

  const handleMenuClose = () => {
    setClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setClosing(false);
    }, 400);
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <>
      <div className="navbar-corner">
        <Link to="/" className="logo">
          <img src="/images/conestoga-logo.png" alt="Conestoga Logo" />
        </Link>

        <div className="corner-controls">

          {/* Notification Bell */}
          {user && user.role !== "Admin" && (
            <div className="notif-wrapper" ref={notifRef}>

              <button className="notif-bell" onClick={() => setNotifOpen((prev) => !prev)}>
                <i className="fi fi-rr-bell"></i>
                {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
              </button>

              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <button className="mark-read-btn" onClick={handleMarkAllRead}>
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Scrollable content in its own div */}
                  <div className="notif-scroll-body">
                    {notifications.length === 0 ? (
                      <p className="notif-empty">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={"notif-item " + (n.isRead ? "read" : "unread") + " " + n.type}
                          onClick={() => handleNotifClick(n)}
                        >
                          <p className="notif-message">{n.message}</p>
                          <span className="notif-time">{formatTime(n.createdAt)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User / Guest area */}
          <div className="welcome-box" ref={dropdownRef}>
            <div className="profile-circle">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="profile" />
              ) : (
                initials
              )}
            </div>

            {user && user.userName !== "Guest" ? (
              <div className="dropdown">
                <button
                  className="welcome-btn"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  Welcome, {user.userName}
                </button>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    <Link to="/edit-profile" onClick={() => setDropdownOpen(false)}>
                      Edit Profile
                    </Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="guest-link">
                Welcome Guest
              </Link>
            )}
          </div>

          <button className="menu-button" onClick={() => setMenuOpen(true)}>
            Menu
          </button>
        </div>
      </div>

      {/* Side menu */}
      {menuOpen && (
        <div className="menu-overlay" onClick={handleMenuClose}>
          <div
            className={"menu-card drop-in " + (closing ? "closing" : "")}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-button" onClick={handleMenuClose}>✕</button>
            <ul className="menu-links">
              {user && user.userName !== "Guest" && (
                <li><Link to="/dashboard" onClick={handleMenuClose}>Dashboard</Link></li>
              )}
              <li><Link to="/news" onClick={handleMenuClose}>News</Link></li>
              <li><Link to="/events" onClick={handleMenuClose}>Events</Link></li>
              <li><Link to="/alumni" onClick={handleMenuClose}>Alumni Directory</Link></li>

              {/* Role-based links */}
              {user && user.userName !== "Guest" && (
                <>
                  <li><Link to="/volunteer" onClick={handleMenuClose}>Volunteer</Link></li>
                  {user.role === "Alumni" ? (
                    <>
                      <li><Link to="/become-mentor" onClick={handleMenuClose}>Be a Mentor</Link></li>
                      <li><Link to="/students" onClick={handleMenuClose}>Student Directory</Link></li>
                    </>
                  ) : user.role === "Student" ? (
                    <>
                      <li><Link to="/mentor" onClick={handleMenuClose}>Request Mentor</Link></li>
                      <li><Link to="/students" onClick={handleMenuClose}>Student Directory</Link></li>
                    </>
                  ) : null}
                  <li><Link to="/edit-profile" onClick={handleMenuClose}>Edit Profile</Link></li>
                </>
              )}

              {/* Guest links */}
              {(!user || user.userName === "Guest") && (
                <>
                  <li><Link to="/login" onClick={handleMenuClose}>Login</Link></li>
                  <li><Link to="/register" onClick={handleMenuClose}>Register</Link></li>
                </>
              )}

              {/* Logout */}
              {user && user.userName !== "Guest" && (
                <li>
                  <button onClick={handleLogout} className="menu-logout-btn">
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;