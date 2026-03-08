import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SideMenu from "../components/SideMenu";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // auto-hide after 3s
  };

// Register.jsx (snippet)
const handleRegister = async () => {
  const btn = document.querySelector(".register-button");
  btn.classList.add("clicked");
  setTimeout(() => btn.classList.remove("clicked"), 600);
  //  Basic validations
  if (!userName.trim()) {
    showNotification("Username is required", "error");
    return;
  }
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    showNotification("Invalid email format", "error");
    return;
  }
  if (password.length < 8) {
    showNotification("Password must be at least 8 characters", "error");
    return;
  }

  //  Call backend
  const response = await fetch("https://localhost:7276/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, email, password, role }),
  });

 if (response.ok) {
  showNotification("Registration successful! Redirecting...", "success");

  // Clear fields
  setUserName("");
  setEmail("");
  setPassword("");
  setRole("Student");

  // Add a CSS class to trigger animation
  document.querySelector(".register-container").classList.add("fade-out");

  // Navigate after animation
  setTimeout(() => navigate("/login"), 2000);
} else {
    const error = await response.text();
    showNotification("⚠️ Registration failed: " + error, "error");
  }
};

  return (
    <div className="register-page">
      <Navbar onMenuClick={() => setMenuOpen(true)} />
      {menuOpen && <SideMenu onClose={() => setMenuOpen(false)} />}

      {/*  Notification banner */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="register-section">
        <div className="register-container">
          <h2 className="register-title">Create Your Account</h2>
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="register-input slide-from-left"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input slide-from-right"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input slide-from-left"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="register-select slide-from-right"
          >
            <option value="Student">Student</option>
            <option value="Alumni">Alumni</option>
            <option value="Staff">Staff</option>
          </select>
          <button onClick={handleRegister} className="register-button animation-item">
            Register
          </button>

          <p className="login-text">
            Already a member? <a href="/login" className="login-link">Login here</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;