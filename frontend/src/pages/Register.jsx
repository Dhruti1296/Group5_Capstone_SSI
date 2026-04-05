import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const API = "http://localhost:5277";

function Register() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRegister = async () => {
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

    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password, role }),
      });

      if (response.ok) {
        showNotification("Registration successful! Redirecting...", "success");
        setUserName("");
        setEmail("");
        setPassword("");
        setRole("Student");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const error = await response.text();
        showNotification("⚠️ Registration failed: " + error, "error");
      }
    } catch (err) {
      showNotification("⚠️ Network error: " + err.message, "error");
    }
  };

  return (
    <div className="register-page">
      <Navbar />

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
            className="register-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="register-input"
          >
            <option value="Student">Student</option>
            <option value="Alumni">Alumni</option>
          </select>
          <button onClick={handleRegister} className="register-button">
            Register
          </button>

          <p className="register-text">
            Already a member?{" "}
            <Link to="/login" className="register-link">Login here</Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;