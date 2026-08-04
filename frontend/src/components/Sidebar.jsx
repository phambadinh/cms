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
<<<<<<< HEAD
          { to: "/mentor/courses", label: "Khóa học của tôi", icon: BookOpen },
          { to: "/mentor/lectures", label: "Bài giảng", icon: Library },
          { to: "/mentor/grades", label: "Điểm số", icon: ClipboardList },
          { to: "/mentor/progress", label: "Tiến độ học viên", icon: TrendingUp },
=======
          { to: "/courses", label: "Khóa học của tôi", icon: BookOpen },
          { to: "/lectures", label: "Bài giảng", icon: Library },
          { to: "/grades", label: "Điểm số", icon: ClipboardList },
          { to: "/progress", label: "Tiến độ học viên", icon: TrendingUp },
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683
        ]
      : [
          { to: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
          { to: "/my-learning", label: "Khóa học của tôi", icon: GraduationCap },
          { to: "/courses", label: "Khám phá khóa học", icon: BookOpen },
          { to: "/learning-progress", label: "Tiến độ học tập", icon: TrendingUp },
          { to: "/certificates", label: "Chứng chỉ", icon: Award },
<<<<<<< HEAD
          { to: "/grades", label: "Điểm số", icon: ClipboardList },
=======
          { to: "/grades", label: "Kết quả Quiz", icon: ClipboardList },
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683
          { to: "/wishlist", label: "Danh sách yêu thích", icon: User },
        ];

  return (
    <aside className="app-sidebar" aria-label="Sidebar điều hướng">
<<<<<<< HEAD
      <div className="app-sidebar-brand">
        <div className="app-sidebar-logo">CMS</div>
        <div className="app-sidebar-copy">
          <div className="app-sidebar-title">Dashboard</div>
          <div className="app-sidebar-role">{role || "Course Student"}</div>
        </div>
      </div>
=======
      <div className="app-sidebar-role">{role || "CMS LMS"}</div>
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683

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