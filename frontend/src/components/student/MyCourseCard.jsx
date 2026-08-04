import {
  PlayCircle,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import "../../styles/student-dashboard.css";

function MyCourseCard({
  course,
  onContinueLearning,
  onViewCertificate,
  onViewCourse,
}) {
  const progress = course.progressPercentage || 0;
  const isCompleted = course.status === "COMPLETED";

  return (
    <div className="student-course-card">
      <div
        className={`student-course-badge ${
          isCompleted ? "student-badge-completed" : "student-badge-active"
        }`}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 size={12} />
            Hoàn thành
          </>
        ) : (
          <>
            <Clock size={12} />
            Đang học
          </>
        )}
      </div>

      <div className="student-course-card-body">
        <div className="student-course-card-icon">
          <BookOpen size={28} strokeWidth={1.5} />
        </div>

        <div className="student-course-card-info">
          <h3 className="student-course-card-name">{course.name}</h3>
          <p className="student-course-card-code">{course.code}</p>
          <span
            className={`student-course-type-tag ${
              course.courseType === "FREE" ? "student-tag-free" : "student-tag-paid"
            }`}
          >
            {course.courseType === "FREE" ? "Miễn phí" : "Có phí"}
          </span>
        </div>
      </div>

      <div className="student-course-progress-section">
        <div className="student-progress-header">
          <span>Tiến độ</span>
          <span className="student-progress-pct">{progress}%</span>
        </div>
        <div className="student-progress-bar-track">
          <div
            className={`student-progress-bar-fill ${
              isCompleted ? "student-fill-completed" : "student-fill-active"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="student-course-card-actions">
        {isCompleted ? (
          <>
            <button
              className="student-btn-certificate"
              onClick={() => onViewCertificate?.(course.id)}
            >
              <Award size={15} />
              Xem chứng chỉ
            </button>
            <button
              className="student-btn-review"
              onClick={() => onContinueLearning?.(course.id)}
            >
              <PlayCircle size={15} />
              Xem lại
            </button>
          </>
        ) : (
          <>
            <button
              className="student-btn-continue"
              onClick={() => onContinueLearning?.(course.id)}
            >
              <PlayCircle size={15} />
              Tiếp tục học
            </button>
            <button
              className="student-btn-detail"
              onClick={() => onViewCourse?.(course.id)}
            >
              Chi tiết
              <ChevronRight size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MyCourseCard;