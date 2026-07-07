// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Forgetpassword from "../pages/Forgetpassword";
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard";
import MentorDashboard from "../pages/MentorDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import Courses from "../pages/Courses";
import Grades from "../pages/Grades";
import CourseDetail from "../pages/CourseDetail";
import AdminModulePage from "../pages/AdminModulePage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminTeachersPage from "../pages/AdminTeachersPage";
import AdminCoursesPage from "../pages/AdminCoursesPage";
import AppLayout from "../layouts/AppLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { getAuthUser } from "../services/api";
import MyLearning from "../pages/MyLearning";
import LearningCourse from "../pages/LearningCourse";
import LearningProgress from "../pages/LearningProgress";
import Certificates from "../pages/Certificate";
import Wishlist from "../pages/Wishlist";

function DashboardRedirect() {
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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ công khai */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Login đứng riêng, không layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Forgetpassword />} />

        {/* Các route còn lại dùng chung AppLayout và có protection */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/mentor" element={<MentorDashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/learning-progress" element={<LearningProgress />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/learning/:courseId" element={<LearningCourse />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/teachers" element={<AdminTeachersPage />} />
          <Route path="/admin/courses" element={<AdminCoursesPage />} />
          <Route path="/admin/lectures" element={<AdminModulePage title="Lectures" subtitle="Quản lý bài học theo từng khóa." entityLabel="Lecture" columns={["Lecture", "Course", "Published", "Actions"]} />} />
          <Route path="/admin/enrollments" element={<AdminModulePage title="Enrollments" subtitle="Theo dõi học viên đăng ký và trạng thái." entityLabel="Enrollment" columns={["Student", "Course", "Progress", "Status", "Actions"]} />} />
          <Route path="/admin/grades" element={<AdminModulePage title="Grades" subtitle="Chấm điểm và theo dõi kết quả học tập." entityLabel="Grade" columns={["Student", "Course", "Score", "Grade", "Actions"]} />} />
          <Route path="/admin/progress" element={<AdminModulePage title="Progress" subtitle="Theo dõi tiến độ học chi tiết." entityLabel="Progress" columns={["Student", "Lesson", "Progress", "Actions"]} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;