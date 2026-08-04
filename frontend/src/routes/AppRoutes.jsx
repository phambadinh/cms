// src/routes/AppRoutes.jsx
<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Forgetpassword from "../pages/Forgetpassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import Profile from "../pages/Profile";
<<<<<<< HEAD
import { AdminDashboard, AdminModulePage, AdminUsersPage, AdminTeachersPage, AdminCoursesPage } from "../components/admin";
import { MentorDashboard, MentorCourses, MentorLectures, MentorProgress } from "../components/mentor";
import {
  StudentDashboard,
  MyLearning,
  LearningCourse,
  LearningQuizPage,
  LearningProgress,
  Certificate,
  Wishlist,
} from "../components/student";
import Courses from "../pages/Courses";
import Grades from "../pages/Grades";
import CourseDetail from "../pages/CourseDetail";
=======
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
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683
import AppLayout from "../layouts/AppLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import EnrollmentRoute from "./EnrollmentRoute";
import { getAuthUser } from "../services/api";
<<<<<<< HEAD
=======
import MyLearning from "../pages/MyLearning";
import LearningCourse from "../pages/LearningCourse";
import LearningQuizPage from "../pages/LearningQuizPage";
import LearningProgress from "../pages/LearningProgress";
import Certificates from "../pages/Certificate";
import Wishlist from "../pages/Wishlist";
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683
import PaymentPage from "../pages/PaymentPage";

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
<<<<<<< HEAD
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
=======
        {/* Trang chủ công khai */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Login đứng riêng, không layout */}
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<Forgetpassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/payment" element={<PaymentPage />} />

<<<<<<< HEAD
=======
        {/* Các route còn lại dùng chung AppLayout và có protection */}
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683
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
<<<<<<< HEAD
          <Route path="/mentor/courses" element={<MentorCourses />} />
          <Route path="/mentor/lectures" element={<MentorLectures />} />
          <Route path="/mentor/progress" element={<MentorProgress />} />
          <Route path="/mentor/grades" element={<Grades />} />
=======
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/learning-progress" element={<LearningProgress />} />
<<<<<<< HEAD
          <Route path="/certificates" element={<Certificate />} />
=======
          <Route path="/certificates" element={<Certificates />} />
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683
          <Route
            path="/learning/:courseId"
            element={
              <EnrollmentRoute>
                <LearningCourse />
              </EnrollmentRoute>
            }
          />
          <Route
            path="/learning/:courseId/quiz/:lessonId"
            element={
              <EnrollmentRoute>
                <LearningQuizPage />
              </EnrollmentRoute>
            }
          />
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
<<<<<<< HEAD
          <Route
            path="/admin/lectures"
            element={
              <AdminModulePage
                title="Lectures"
                subtitle="Quản lý bài học theo từng khóa."
                entityLabel="Lecture"
                columns={["Lecture", "Course", "Published", "Actions"]}
              />
            }
          />
          <Route
            path="/admin/enrollments"
            element={
              <AdminModulePage
                title="Enrollments"
                subtitle="Theo dõi học viên đăng ký và trạng thái."
                entityLabel="Enrollment"
                columns={["Student", "Course", "Progress", "Status", "Actions"]}
              />
            }
          />
          <Route
            path="/admin/grades"
            element={
              <AdminModulePage
                title="Grades"
                subtitle="Chấm điểm và theo dõi kết quả học tập."
                entityLabel="Grade"
                columns={["Student", "Course", "Score", "Grade", "Actions"]}
              />
            }
          />
          <Route
            path="/admin/progress"
            element={
              <AdminModulePage
                title="Progress"
                subtitle="Theo dõi tiến độ học chi tiết."
                entityLabel="Progress"
                columns={["Student", "Lesson", "Progress", "Actions"]}
              />
            }
          />
=======
          <Route path="/admin/lectures" element={<AdminModulePage title="Lectures" subtitle="Quản lý bài học theo từng khóa." entityLabel="Lecture" columns={["Lecture", "Course", "Published", "Actions"]} />} />
          <Route path="/admin/enrollments" element={<AdminModulePage title="Enrollments" subtitle="Theo dõi học viên đăng ký và trạng thái." entityLabel="Enrollment" columns={["Student", "Course", "Progress", "Status", "Actions"]} />} />
          <Route path="/admin/grades" element={<AdminModulePage title="Grades" subtitle="Chấm điểm và theo dõi kết quả học tập." entityLabel="Grade" columns={["Student", "Course", "Score", "Grade", "Actions"]} />} />
          <Route path="/admin/progress" element={<AdminModulePage title="Progress" subtitle="Theo dõi tiến độ học chi tiết." entityLabel="Progress" columns={["Student", "Lesson", "Progress", "Actions"]} />} />
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

<<<<<<< HEAD
export default AppRoutes;
=======
export default AppRoutes;
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683
