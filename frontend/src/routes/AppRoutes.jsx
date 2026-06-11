// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Forgetpassword from "../pages/Forgetpassword";
import AdminDashboard from "../pages/AdminDashboard";
import MentorDashboard from "../pages/MentorDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import Courses from "../pages/Courses";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import Lectures from "../pages/Lectures";
import Grades from "../pages/Grades";
import Progress from "../pages/Progress";
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
        {/* Login đứng riêng, không layout */}
        <Route path="/" element={<Login />} />
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
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/mentor" element={<MentorDashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/progress" element={<Progress />} />
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