import { NavLink, useNavigate } from "react-router-dom";
import { authLogout, getAuthUser } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";

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
  LogOut,
} from "lucide-react";

const adminItems = [
  { to: "/admin/dashboard", vi: "Tổng quan", en: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", vi: "Người dùng", en: "Users", icon: Users },
  { to: "/admin/teachers", vi: "Mentor", en: "Mentors", icon: GraduationCap },
  { to: "/admin/courses", vi: "Khóa học", en: "Courses", icon: BookOpen },
  { to: "/admin/lectures", vi: "Bài học", en: "Lessons", icon: PlayCircle },
  { to: "/admin/enrollments", vi: "Đăng ký", en: "Enrollments", icon: ClipboardList },
  { to: "/admin/grades", vi: "Điểm số", en: "Grades", icon: BarChart3 },
  { to: "/admin/progress", vi: "Tiến độ", en: "Progress", icon: TrendingUp },
  { to: "/admin/feedbacks", vi: "Phản hồi", en: "Feedback", icon: MessageSquare },
  { to: "/admin/certificates", vi: "Chứng chỉ", en: "Certificates", icon: Award },
];

function AdminSidebar() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const { isVietnamese } = useLanguage();

  const displayName =
    user?.fullName || user?.username || "Administrator";

  const avatarInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    authLogout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">CMS</div>

        <div>
          <div className="admin-sidebar-title">
            {isVietnamese ? "Dashboard Admin" : "Admin Dashboard"}
          </div>

          <div className="admin-sidebar-subtitle">
            {isVietnamese ? "Hệ thống quản lý khóa học" : "Course Management System"}
          </div>
        </div>
      </div>

      <nav
        className="admin-sidebar-nav"
        aria-label={isVietnamese ? "Điều hướng quản trị" : "Admin navigation"}
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
              <span>{isVietnamese ? item.vi : item.en}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <button
          type="button"
          className="admin-sidebar-action logout"
          onClick={handleLogout}
          aria-label={isVietnamese ? "Đăng xuất" : "Log out"}
        >
          <LogOut size={18} strokeWidth={2} />
          <span>{isVietnamese ? "Đăng xuất" : "Log out"}</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;