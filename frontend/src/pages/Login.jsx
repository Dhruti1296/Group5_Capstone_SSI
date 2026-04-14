import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import "./Login.css";

const API = "http://localhost:5277";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);

  const { saveToken, refreshUser } = useContext(UserContext);
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
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
        saveToken(data.token, {
          userName: data.userName,
          email: data.email,
          role: data.role,
        });
        await refreshUser();
        navigate(data.role === "Admin" ? "/admin/dashboard" : "/dashboard");
      } else {
        const errText = await res.text();
        showNotification(errText.replace(/^"|"$/g, ""), "error");
      }
    } catch (err) {
      showNotification("Network error: " + err.message, "error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-page">
      <Navbar />

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
            onKeyDown={handleKeyDown}
            className="login-input slide-from-right"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
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
