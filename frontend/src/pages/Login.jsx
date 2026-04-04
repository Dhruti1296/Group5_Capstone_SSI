import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import "./Login.css";

function Login() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);

  const { setUser, saveToken, refreshUser } = useContext(UserContext);
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async () => {
    const btn = document.querySelector(".login-button");
    btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 600);

    try {
      const response = await fetch("http://localhost:5277/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Save token first — must be done before refreshUser
        saveToken(data.token);

        // Set basic user info immediately so UI isn't blank
        setUser({
          userName: data.userName,
          email: data.email,
          role: data.role,
          profilePic: null,
        });

        // Now fetch full profile including profilePic from MongoDB
        await refreshUser();

        showNotification("Login successful! Redirecting...", "success");
        setUserName("");
        setPassword("");
        document.querySelector(".login-container").classList.add("fade-out");
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        const error = await response.text();
        showNotification("⚠️ Login failed: " + error, "error");
      }
    } catch (err) {
      showNotification("⚠️ Network error: " + err.message, "error");
    }
  };

  return (
    <div className="login-page">
      {menuOpen && <SideMenu onClose={() => setMenuOpen(false)} />}

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="login-section">
        <div className="login-container section-title content-appeared">
          <h2 className="slide-from-left">Welcome Back</h2>
          <p className="section-intro-text content-appeared">
            Please log in to continue
          </p>

          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="login-input slide-from-right"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input slide-from-left"
          />
          <button onClick={handleLogin} className="login-button animation-item">
            Login
          </button>

          <p className="register-text">
            Not a member yet?{" "}
            <Link to="/register" className="register-link">
              Register here
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;