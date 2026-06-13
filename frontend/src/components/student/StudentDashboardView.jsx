import "../../styles/dashboard.css";

import LearningStats from "./LearningStats";
import MyCourseCard from "./MyCourseCard";

function StudentDashboardView({
  title,
  subtitle,
  courses = [],
  enrollments = [],
  loading = false,
  error = "",
  onContinueLearning,
}) {
  return (
    <div className="layout-main dashboard-shell">
      <h1 className="dash-title">{title}</h1>

      <p className="dash-subtitle">
        {subtitle}
      </p>

      {error && (
        <p className="dash-error">
          {error}
        </p>
      )}

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <LearningStats
            totalCourses={courses.length}
            completedCourses={
              enrollments.filter(
                (e) =>
                  e.progressPercentage === 100
              ).length
            }
            learningCourses={
              enrollments.filter(
                (e) =>
                  (e.progressPercentage ?? 0) <
                  100
              ).length
            }
          />

          <section className="student-course-section">
            <div className="section-header">
              <h2>Khóa học của tôi</h2>
            </div>

            <div className="student-course-grid">
              {courses.map((course) => (
                <MyCourseCard
                  key={course.id}
                  course={course}
                  onContinueLearning={
                    onContinueLearning
                  }
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default StudentDashboardView;