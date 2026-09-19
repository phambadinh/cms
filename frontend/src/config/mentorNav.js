// src/config/mentorNav.js
import { BookOpen, ClipboardList, LayoutDashboard, Library, ListChecks, Newspaper, TrendingUp } from "lucide-react";

export const MENTOR_NAV = [
  {
    to: "/mentor/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    description: "Tổng quan hoạt động dạy học, học viên và tiến độ lớp.",
    showAsQuickAction: false,
  },
  {
    to: "/mentor/courses",
    icon: BookOpen,
    label: "Khóa học của tôi",
    description: "Quản lý danh sách khóa học, trạng thái xuất bản và số học viên.",
    showAsQuickAction: true,
  },
  {
    to: "/mentor/lectures",
    icon: Library,
    label: "Bài giảng",
    description: "Theo dõi bài giảng theo từng khóa và trạng thái hiển thị.",
    showAsQuickAction: true,
  },
  {
    to: "/mentor/quizzes",
    icon: ListChecks,
    label: "Quiz",
    description: "Tạo và quản lý bài kiểm tra, câu hỏi và đáp án.",
    showAsQuickAction: true,
  },
  {
    to: "/mentor/blog",
    icon: Newspaper,
    label: "Blog",
    description: "Tạo và xuất bản bài viết kiến thức.",
    showAsQuickAction: true,
  },
  {
    to: "/mentor/grades",
    icon: ClipboardList,
    label: "Điểm số",
    description: "Xem và chấm điểm kết quả học tập của học viên.",
    showAsQuickAction: true,
  },
  {
    to: "/mentor/progress",
    icon: TrendingUp,
    label: "Tiến độ học viên",
    description: "Theo dõi tiến độ hoàn thành của từng lớp học viên.",
    showAsQuickAction: true,
  },
];

export const MENTOR_QUICK_ACTIONS = MENTOR_NAV.filter((item) => item.showAsQuickAction);