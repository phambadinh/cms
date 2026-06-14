import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyEnrollments,
  getCourseById,
} from "../services/api";

import StudentDashboardView from "../components/student/StudentDashboardView";

function StudentDashboard() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      setLoading(true);

      const enrollmentRes = await getMyEnrollments();

      const enrollments = enrollmentRes.data || [];

      const courseData = await Promise.all(
        enrollments.map(async (enrollment) => {
          try {
            const courseRes = await getCourseById(
              enrollment.courseId
            );

            return {
              ...courseRes.data,
              enrollmentId: enrollment.id,
              status: enrollment.status,
              progressPercentage:
                enrollment.progressPercentage || 0,
            };
          } catch {
            return null;
          }
        })
      );

      const validCourses = courseData.filter(Boolean);

      setCourses(validCourses);

      setStats([
        {
          label: "Tổng khóa học",
          value: validCourses.length,
        },
        {
          label: "Hoàn thành",
          value: validCourses.filter(
            (c) => c.status === "COMPLETED"
          ).length,
        },
        {
          label: "Đang học",
          value: validCourses.filter(
            (c) => c.status === "ACTIVE"
          ).length,
        },
      ]);
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

  return (
    <StudentDashboardView
      title="Khóa học của tôi"
      subtitle="Theo dõi tiến độ học tập và tiếp tục học."
      stats={stats}
      courses={courses}
      loading={loading}
      error={error}
      onContinueLearning={handleContinueLearning}
    />
  );
}

export default StudentDashboard;