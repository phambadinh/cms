import { NavLink } from "react-router-dom";
import { getAuthUser } from "../../services/api";

const adminItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/teachers", label: "Giảng viên" },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/lectures", label: "Lectures" },
  { to: "/admin/enrollments", label: "Enrollments" },
  { to: "/admin/grades", label: "Grades" },
  { to: "/admin/progress", label: "Progress" },
];

function AdminSidebar() {
  const user = getAuthUser();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">UTH</div>
        <div>
          <div className="admin-sidebar-title">Learning Admin</div>
          <div className="admin-sidebar-subtitle">{user?.fullName || user?.username || "Admin"}</div>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        {adminItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? "admin-sidebar-link active" : "admin-sidebar-link"} end={item.to === "/admin/dashboard"}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;