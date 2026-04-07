import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login({ userName, password });
      // Store in localStorage
      localStorage.setItem("username", res.data.userName);
      localStorage.setItem("role", res.data.role);
      // Role-based redirect
      if (res.data.role === "Admin")
        navigate("/admin");
      else
        navigate("/");
    }
    catch (err) {
      setError(err.response?.data || "Invalid username or password");
    }
  };
  return (
    <div>
      {/* HEADER */}
      <div className="bg-primary text-white text-center py-4">
        <h2>
          Student Service Interface
        </h2>
        <p>
          Login to access your account
        </p>
      </div>
      {/* LOGIN CARD */}
      <div className="container mt-5 d-flex justify-content-center">
        <div className="card shadow-lg col-md-5 border-0">
          <div className="card-body p-4">
            <h3 className="text-center mb-4">
              Login
            </h3>
            {/* Error Message */}
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">
                  Username
                </label>
                <input
                  className="form-control"
                  placeholder="Enter Username"
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-primary w-100">
                Login
              </button>
            </form>
            <div className="text-center mt-3">
              No account?
              <Link to="/register">
                {" "}Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* FOOTER */}
      <footer className="bg-dark text-white text-center p-2 mt-5">
        © 2026 SSI Capstone Project
      </footer>
    </div>
  );
}
export default Login;
