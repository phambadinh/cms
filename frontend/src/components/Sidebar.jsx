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

function Sidebar() {
  const user = getAuthUser();
  const role = user?.role;

  const items =
    role === "ADMIN"
      ? [
          {
            to: "/admin/dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard size={18} />,
          },
          {
            to: "/admin/courses",
            label: "Khóa học",
            icon: <BookOpen size={18} />,
          },
          {
            to: "/admin/users",
            label: "Học viên",
            icon: <Users size={18} />,
          },
          {
            to: "/admin/teachers",
            label: "Giảng viên",
            icon: <UserCog size={18} />,
          },
          {
            to: "/admin/grades",
            label: "Điểm số",
            icon: <ClipboardList size={18} />,
          },
          {
            to: "/admin/progress",
            label: "Tiến độ",
            icon: <TrendingUp size={18} />,
          },
        ]
      : role === "MENTOR"
      ? [
          {
            to: "/dashboard/mentor",
            label: "Dashboard",
            icon: <LayoutDashboard size={18} />,
          },
          {
            to: "/courses",
            label: "Khóa học của tôi",
            icon: <BookOpen size={18} />,
          },
          {
            to: "/lectures",
            label: "Bài giảng",
            icon: <Library size={18} />,
          },
          {
            to: "/grades",
            label: "Điểm số",
            icon: <ClipboardList size={18} />,
          },
          {
            to: "/progress",
            label: "Tiến độ học viên",
            icon: <TrendingUp size={18} />,
          },
        ]
      : [
          {
            to: "/dashboard/student",
            label: "Dashboard",
            icon: <LayoutDashboard size={18} />,
          },
          {
            to: "/my-learning",
            label: "Khóa học của tôi",
            icon: <GraduationCap size={18} />,
          },
          {
            to: "/courses",
            label: "Khám phá khóa học",
            icon: <BookOpen size={18} />,
          },
          {
            to: "/learning-progress",
            label: "Tiến độ học tập",
            icon: <TrendingUp size={18} />,
          },
          {
            to: "/certificates",
            label: "Chứng chỉ",
            icon: <Award size={18} />,
          },
          {
            to: "/grades",
            label: "Kết quả Quiz",
            icon: <ClipboardList size={18} />,
          },
          {
            to: "/profile",
            label: "Hồ sơ cá nhân",
            icon: <User size={18} />,
          },
        ];

  return (
    <aside
      style={{
        width: "260px",
        minHeight: "calc(100vh - 64px)",
        padding: "24px",
        background:
          "linear-gradient(180deg, #ffffff 0%, #f3f8ff 100%)",
        borderRight: "1px solid var(--cms-border)",
        boxShadow: "8px 0 24px rgba(15,76,129,0.05)",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "18px",
          color: "var(--cms-blue-900)",
          marginBottom: "24px",
        }}
      >
        {role || "CMS LMS"}
      </div>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gap: "10px",
        }}
      >
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "12px",
                textDecoration: "none",
                color: isActive ? "#fff" : "#334155",
                background: isActive
                  ? "linear-gradient(135deg,#2563eb,#60a5fa)"
                  : "transparent",
                fontWeight: isActive ? 700 : 500,
                transition: "all 0.2s ease",
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;