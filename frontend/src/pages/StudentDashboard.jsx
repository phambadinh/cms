import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEnrollments, getCourseById } from "../services/api";
import Sidebar from "../components/Sidebar";
import StudentDashboardView from "../components/student/StudentDashboardView";

function StudentDashboard() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      setLoading(true);

      const enrollmentRes = await getMyEnrollments();
      const enrollmentList = enrollmentRes.data || [];
      setEnrollments(enrollmentList);

      const courseData = await Promise.all(
        enrollmentList.map(async (enrollment) => {
          try {
            const courseRes = await getCourseById(enrollment.courseId);

            return {
              ...courseRes.data,
              enrollmentId: enrollment.id,
              status: enrollment.status,
              progressPercentage: enrollment.progressPercentage || 0,
              enrolledAt: enrollment.enrolledAt,
              completedAt: enrollment.completedAt,
            };
          } catch {
            return null;
          }
        })
      );

      setCourses(courseData.filter(Boolean));
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu học tập");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueLearning = (courseId) => {
    navigate(`/learning/${courseId}`);
  };

  const handleViewCertificate = (courseId) => {
    navigate(`/certificate/${courseId}`);
  };

  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="layout">
      <div className="layout-body">
        <Sidebar />
        <main className="layout-main">
          <StudentDashboardView
            courses={courses}
            enrollments={enrollments}
            loading={loading}
            error={error}
            onContinueLearning={handleContinueLearning}
            onViewCertificate={handleViewCertificate}
            onViewCourse={handleViewCourse}
          />
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;