// src/components/admin/AdminSidebar.jsx

import { NavLink } from "react-router-dom";
import { getAuthUser } from "../../services/api";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  PlayCircle,
  ClipboardList,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Award,
  Settings,
  LogOut,
} from "lucide-react";

const adminItems = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    to: "/admin/teachers",
    label: "Mentors",
    icon: GraduationCap,
  },
  {
    to: "/admin/courses",
    label: "Courses",
    icon: BookOpen,
  },
  {
    to: "/admin/lectures",
    label: "Lessons",
    icon: PlayCircle,
  },
  {
    to: "/admin/enrollments",
    label: "Enrollments",
    icon: ClipboardList,
  },
  {
    to: "/admin/grades",
    label: "Grades",
    icon: BarChart3,
  },
  {
    to: "/admin/progress",
    label: "Progress",
    icon: TrendingUp,
  },
  {
    to: "/admin/feedbacks",
    label: "Feedbacks",
    icon: MessageSquare,
  },
  {
    to: "/admin/certificates",
    label: "Certificates",
    icon: Award,
  },
];

function AdminSidebar() {
  const user = getAuthUser();

  return (
    <aside className="admin-sidebar">
      {/* Logo */}

      <div className="admin-sidebar-brand">
        <div className="admin-logo-circle">
          CMS
        </div>

        <div>
          <h3>Learning Admin</h3>
          <p>Management System</p>
        </div>
      </div>

      {/* User */}

      <div className="admin-user-card">
        <div className="admin-avatar">
          {(user?.fullName || user?.username || "A")
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <h4>
            {user?.fullName ||
              user?.username}
          </h4>

          <span>Administrator</span>
        </div>
      </div>

      {/* Menu */}

      <nav className="admin-sidebar-nav">
        {adminItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={
                item.to ===
                "/admin/dashboard"
              }
              className={({ isActive }) =>
                isActive
                  ? "admin-sidebar-link active"
                  : "admin-sidebar-link"
              }
            >
              <Icon size={20} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}

      <div className="admin-sidebar-footer">

        <button className="admin-sidebar-action">

          <Settings size={18} />

          <span>Settings</span>

        </button>

        <button className="admin-sidebar-action logout">

          <LogOut size={18} />

          <span>Logout</span>

        </button>

      </div>
    </aside>
  );
}

export default AdminSidebar;