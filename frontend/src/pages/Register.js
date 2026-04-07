import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    role: "Student"
  });

  const navigate = useNavigate();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Registered Successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };
  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">Create Account</h3>
          <p className="text-muted">Student Service Interface</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            name="userName"
            className="form-control mb-3"
            placeholder="Enter Username"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            className="form-control mb-3"
            placeholder="Enter Email"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            className="form-control mb-3"
            placeholder="Enter Password"
            onChange={handleChange}
            required
          />
          <select
            name="role"
            className="form-control mb-4"
            onChange={handleChange}
          >
            <option>Student</option>
            <option>Alimini</option>
          </select>
          <button className="btn btn-success w-100 mb-3">
            Register
          </button>
        </form>
        <div className="text-center">
          <small>
            Already have account?{" "}
            <Link to="/login">Login here</Link>
          </small>
        </div>
      </div>
    </div>
  );
}
export default Register;