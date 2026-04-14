import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function AdminRoute({ children }) {
  const { user, authReady } = useContext(UserContext);
  console.log("AdminRoute — authReady:", authReady, "| user:", user);
  if (!authReady) return null;

  if (!user) return <Navigate to="/admin/login" replace />;

  if (user.role !== "Admin") return <Navigate to="/admin/login" replace />;

  return children;
}

export default AdminRoute;
