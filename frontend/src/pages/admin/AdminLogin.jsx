import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./AdminLogin.css";

const API = "http://localhost:5277";

function AdminLogin() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const { setUser, saveToken, setAuthReady } = useContext(UserContext);
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      if (res.ok) {
        const data = await res.json();

        if (data.role !== "Admin") {
          showNotification("Access denied. Admins only.", "error");
          return;
        }

        saveToken(data.token);
        setUser({
          userName: data.userName,
          role: data.role,
        });
        setAuthReady(true);

        navigate("/admin/dashboard");
      } else {
        const err = await res.text();
        showNotification("Login failed: " + err, "error");
      }
    } catch (err) {
      showNotification("Network error: " + err.message, "error");
    }
  };

  return (
    <div className="admin-login-page">
      {notification && (
        <div className={"admin-notification " + notification.type}>
          {notification.message}
        </div>
      )}

      <div className="admin-login-card">
        <h2>Admin Panel</h2>
        <p>Restricted access — authorized personnel only</p>

        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="admin-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input"
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button className="admin-login-btn" onClick={handleLogin}>
          Login
        </button>

        {/* Navigation links */}
        <div className="admin-login-links">
          <Link to="/login" className="admin-back-link">
            ← Back to User Login
          </Link>
          <Link to="/" className="admin-back-link">
            Go to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
