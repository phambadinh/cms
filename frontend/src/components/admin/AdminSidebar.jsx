import { NavLink, useNavigate } from "react-router-dom";
import { authLogout, getAuthUser } from "../../services/api";

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
  const navigate = useNavigate();
  const user = getAuthUser();

  const displayName =
    user?.fullName || user?.username || "Administrator";

  const avatarInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    authLogout();
    navigate("/login", { replace: true });
  };

  const handleSettings = () => {
    navigate("/profile");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">CMS</div>

        <div>
          <div className="admin-sidebar-title">
            Dashboard Admin
          </div>

          <div className="admin-sidebar-subtitle">
            Course Management System
          </div>
        </div>
      </div>

      <nav
        className="admin-sidebar-nav"
        aria-label="Admin navigation"
      >
        {adminItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin/dashboard"}
              className={({ isActive }) =>
                isActive
                  ? "admin-sidebar-link active"
                  : "admin-sidebar-link"
              }
            >
              <Icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <button
          type="button"
          className="admin-sidebar-action"
          onClick={handleSettings}
          aria-label="Open settings"
        >
          <Settings size={18} strokeWidth={2} />
          <span>Settings</span>
        </button>

        <button
          type="button"
          className="admin-sidebar-action logout"
          onClick={handleLogout}
          aria-label="Log out"
        >
          <LogOut size={18} strokeWidth={2} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;