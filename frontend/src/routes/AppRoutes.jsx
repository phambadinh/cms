import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Blog from "../pages/Blog";
import BlogDetail from "../pages/BlogDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Forgetpassword from "../pages/Forgetpassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import Team from "../pages/Team";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";
import Cookies from "../pages/Cookies";
import Profile from "../pages/Profile";
import Courses from "../pages/Courses";
import Grades from "../pages/Grades";
import CourseDetail from "../pages/CourseDetail";
import PaymentPage from "../pages/PaymentPage";
import AppLayout from "../layouts/AppLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import EnrollmentRoute from "./EnrollmentRoute";
import { getAuthUser } from "../services/api";
import QuizManagementPage from "../components/quiz/QuizManagementPage";
import { getAllCourses, getMyCreatedCourses } from "../services/api";

import {
  AdminDashboard,
  AdminUsersPage,
  AdminTeachersPage,
  AdminCoursesPage,
  AdminBlogPage,
  AdminLessonsPage,
  AdminEnrollmentsPage,
  AdminGradesPage,
  AdminProgressPage,
  AdminCertificatesPage,
  AdminFeedbackPage,
} from "../components/admin";
import {
  MentorDashboard,
  MentorCourses,
  MentorLectures,
  MentorGrades,
  MentorProgress,
} from "../components/mentor";
import {
  StudentDashboard,
  MyLearning,
  LearningCourse,
  LearningQuizPage,
  LearningProgress,
  Certificate,
  Wishlist,
} from "../components/student";

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

function ProfileRedirect() {
  const user = getAuthUser();

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin/profile" replace />;
  }

  return <Profile />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/team" element={<Team />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/forgot-password" element={<Forgetpassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* Logged-in user pages */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element={<ProfileRedirect />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />

          <Route element={<RoleRoute allowedRoles={["MENTOR"]} />}>
            <Route path="/dashboard/mentor" element={<MentorDashboard />} />
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route path="/mentor/courses" element={<MentorCourses />} />
            <Route path="/mentor/lectures" element={<MentorLectures />} />
            <Route path="/mentor/quizzes" element={<QuizManagementPage loadCourses={getMyCreatedCourses} roleLabel="MENTOR" />} />
            <Route path="/mentor/blog" element={<AdminBlogPage />} />
            <Route path="/mentor/progress" element={<MentorProgress />} />
            <Route path="/mentor/grades" element={<MentorGrades />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["STUDENT"]} />}>
            <Route path="/dashboard/student" element={<StudentDashboard />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/my-learning" element={<MyLearning />} />
            <Route path="/learning-progress" element={<LearningProgress />} />
            <Route path="/certificates" element={<Certificate />} />
            <Route path="/wishlist" element={<Wishlist />} />

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
          </Route>
        </Route>

        {/* Admin-only pages */}
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
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/teachers" element={<AdminTeachersPage />} />
          <Route path="/admin/courses" element={<AdminCoursesPage />} />
          <Route path="/admin/blog" element={<AdminBlogPage />} />
          <Route path="/admin/quizzes" element={<QuizManagementPage loadCourses={getAllCourses} roleLabel="ADMIN" />} />
          <Route path="/admin/certificates" element={<AdminCertificatesPage />} />

          <Route path="/admin/lectures" element={<AdminLessonsPage />} />
          <Route path="/admin/enrollments" element={<AdminEnrollmentsPage />} />
          <Route path="/admin/grades" element={<AdminGradesPage />} />
          <Route path="/admin/progress" element={<AdminProgressPage />} />
          <Route path="/admin/feedbacks" element={<AdminFeedbackPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;