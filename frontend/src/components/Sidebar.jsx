import { NavLink } from "react-router-dom";
import { getAuthUser } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
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
  ListChecks,
  Newspaper,
} from "lucide-react";
import "../styles/sidebar.css";

function Sidebar() {
  const user = getAuthUser();
  const role = user?.role;
  const { isVietnamese } = useLanguage();
  const text = (vi, en) => (isVietnamese ? vi : en);

  const items = role === "ADMIN"
    ? [
        { to: "/admin/dashboard", label: text("Tổng quan", "Overview"), icon: LayoutDashboard },
        { to: "/admin/courses", label: text("Khóa học", "Courses"), icon: BookOpen },
        { to: "/admin/users", label: text("Học viên", "Students"), icon: Users },
        { to: "/admin/teachers", label: text("Giảng viên", "Mentors"), icon: UserCog },
        { to: "/admin/grades", label: text("Điểm số", "Grades"), icon: ClipboardList },
        { to: "/admin/progress", label: text("Tiến độ", "Progress"), icon: TrendingUp },
        { to: "/admin/feedbacks", label: text("Phản hồi", "Feedback"), icon: User },
        { to: "/admin/certificates", label: text("Chứng chỉ", "Certificates"), icon: Award },
      ]
    : role === "MENTOR"
      ? [
          { to: "/dashboard/mentor", label: text("Tổng quan", "Dashboard"), icon: LayoutDashboard },
          { to: "/mentor/courses", label: text("Khóa học của tôi", "My courses"), icon: BookOpen },
          { to: "/mentor/lectures", label: text("Bài giảng", "Lessons"), icon: Library },
          { to: "/mentor/quizzes", label: "Quiz", icon: ListChecks },
          { to: "/mentor/blog", label: "Blog", icon: Newspaper },
          { to: "/mentor/grades", label: text("Điểm số", "Grades"), icon: ClipboardList },
          { to: "/mentor/progress", label: text("Tiến độ học viên", "Student progress"), icon: TrendingUp },
        ]
      : [
          { to: "/dashboard/student", label: text("Tổng quan", "Dashboard"), icon: LayoutDashboard },
          { to: "/my-learning", label: text("Khóa học của tôi", "My learning"), icon: GraduationCap },
          { to: "/courses", label: text("Khám phá khóa học", "Explore courses"), icon: BookOpen },
          { to: "/learning-progress", label: text("Tiến độ học tập", "Learning progress"), icon: TrendingUp },
          { to: "/certificates", label: text("Chứng chỉ", "Certificates"), icon: Award },
          { to: "/grades", label: text("Điểm số", "Grades"), icon: ClipboardList },
          { to: "/wishlist", label: text("Danh sách yêu thích", "Wishlist"), icon: User },
        ];

  return (
    <aside className="app-sidebar" aria-label={text("Thanh điều hướng", "Navigation sidebar")}>
      <div className="app-sidebar-brand">
        <div className="app-sidebar-logo">CMS</div>
        <div className="app-sidebar-copy">
          <div className="app-sidebar-title">{text("Tổng quan", "Dashboard")}</div>
          <div className="app-sidebar-role">{role || text("Học viên khóa học", "Course student")}</div>
        </div>
      </div>

      <ul className="app-sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to} className="app-sidebar-item">
              <NavLink
                to={item.to}
                className={({ isActive }) => `app-sidebar-link ${isActive ? "active" : ""}`.trim()}
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
