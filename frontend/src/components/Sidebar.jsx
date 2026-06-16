// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { getAuthUser } from "../services/api";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  UserCog,
  ClipboardList,
  TrendingUp,
  Award,
  User,
  Library,
} from "lucide-react";
import "../styles/sidebar.css";

function Sidebar() {
  const user = getAuthUser();
  const role = user?.role;

  const items =
    role === "ADMIN"
      ? [
          { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { to: "/admin/courses", label: "Khóa học", icon: BookOpen },
          { to: "/admin/users", label: "Học viên", icon: Users },
          { to: "/admin/teachers", label: "Giảng viên", icon: UserCog },
          { to: "/admin/grades", label: "Điểm số", icon: ClipboardList },
          { to: "/admin/progress", label: "Tiến độ", icon: TrendingUp },
        ]
      : role === "MENTOR"
      ? [
          { to: "/dashboard/mentor", label: "Dashboard", icon: LayoutDashboard },
          { to: "/courses", label: "Khóa học của tôi", icon: BookOpen },
          { to: "/lectures", label: "Bài giảng", icon: Library },
          { to: "/grades", label: "Điểm số", icon: ClipboardList },
          { to: "/progress", label: "Tiến độ học viên", icon: TrendingUp },
        ]
      : [
          { to: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
          { to: "/my-learning", label: "Khóa học của tôi", icon: GraduationCap },
          { to: "/courses", label: "Khám phá khóa học", icon: BookOpen },
          { to: "/learning-progress", label: "Tiến độ học tập", icon: TrendingUp },
          { to: "/certificates", label: "Chứng chỉ", icon: Award },
          { to: "/grades", label: "Kết quả Quiz", icon: ClipboardList },
          { to: "/profile", label: "Hồ sơ cá nhân", icon: User },
        ];

  return (
    <aside className="app-sidebar" aria-label="Sidebar điều hướng">
      <div className="app-sidebar-role">{role || "CMS LMS"}</div>

      <ul className="app-sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to} className="app-sidebar-item">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `app-sidebar-link ${isActive ? "active" : ""}`.trim()
                }
              >
                <Icon className="app-sidebar-icon" size={18} strokeWidth={2} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;