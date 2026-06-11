import { Navigate } from "react-router-dom";
import { getAuthUser } from "../services/api";

function Dashboard() {
  const user = getAuthUser();

  if (!user?.role) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "MENTOR") {
    return <Navigate to="/dashboard/mentor" replace />;
  }

  return <Navigate to="/dashboard/student" replace />;
}

export default Dashboard;