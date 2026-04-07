import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload(); // logic that fixes old username showing issue
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4">
      {/* Logo */}
      <Link className="navbar-brand fw-bold fs-4" to="/">SSI</Link>
      {/* Right side */}
      <div className="ms-auto d-flex align-items-center">
        <Link className="nav-link text-light me-3" to="/">Home</Link>
        {!username && (
          <Link className="nav-link text-light me-3" to="/login">
            Login
          </Link>
        )}
        {username && role !== "Admin" && (
          <>
            <Link className="nav-link text-light me-3" to="/profile">
             Profile
            </Link>
            <Link className="nav-link text-light me-3" to="/notifications">
              Notifications
            </Link>
            <Link className="nav-link" to="/contact">Contact Us</Link>
            {/* Username */}
            <span className="text-light me-3">
              Welcome, <strong>{username}</strong>
            </span>

            <button
              className="btn btn-danger btn-sm"
              onClick={handleLogout}>Logout </button>
          </>
        )}
        {username && role === "Admin" && (
          <>
            <Link
              className="nav-link text-warning me-3"
              to="/admin">Admin Panel</Link>
            {/* Username */}
            <span className="text-light me-3">
              Admin: <strong>{username}</strong>
            </span>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
          
        )}
      </div>
    </nav>
  );
}

export default Navbar;
