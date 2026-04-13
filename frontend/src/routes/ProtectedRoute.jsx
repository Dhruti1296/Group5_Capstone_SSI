import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function ProtectedRoute({ children }) {
  const { user, authReady } = useContext(UserContext);

  if (!authReady) return null;

  // Admin should never access regular user routes
  if (user?.role === "Admin") return <Navigate to="/admin/dashboard" replace />;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
