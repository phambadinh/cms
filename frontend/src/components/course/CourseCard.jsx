import {
  Users,
  Star,
  BookOpen,
  ArrowRight,
  Clock,
} from "lucide-react";

import htmlImg from "./html.png";

function CourseCard({
  course,
  onView,
  onEnroll,
  loading,
}) {
  return (
    <div className="course-card">

      <div className="course-image-wrapper">

        <img
          src={course.thumbnail || htmlImg}
          alt={course.name}
          className="course-image"
          onError={(e) => {
            e.target.src = htmlImg;
          }}
        />

        <span className="course-tag">
          {course.level || "Beginner"}
        </span>

      </div>

      <div className="course-body">

        <h3 className="course-title">
          {course.name}
        </h3>

        <p className="course-description">
          {course.description
            ? course.description.slice(0, 80) + "..."
            : "Khóa học chất lượng giúp bạn nâng cao kỹ năng và phát triển nghề nghiệp."}
        </p>

        <div className="course-stats">

          <span>
            <Users size={14} />
            {" "}
            {course.enrollmentCount || 0}
          </span>

          <span>
            <Star size={14} />
            {" "}
            {course.rating || 0}
          </span>

          <span>
            <BookOpen size={14} />
            {" "}
            {course.totalLessons || 0}
          </span>

          <span>
            <Clock size={14} />
            12h
          </span>

        </div>

        <div className="course-footer">

          <div className="course-price">

            {course.courseType === "FREE"
              ? "Miễn phí"
              : `${course.price?.toLocaleString("vi-VN")} đ`}

          </div>

          <button
            className="detail-btn"
            onClick={() =>
              onView(course.id || course._id)
            }
          >
            Chi tiết
            <ArrowRight size={15} />
          </button>

        </div>

        {course.courseType === "FREE" && (
          <button
            className="enroll-btn"
            disabled={loading}
            onClick={() =>
              onEnroll(course.id || course._id)
            }
          >
            {loading
              ? "Đang đăng ký..."
              : "Đăng ký ngay"}
          </button>
        )}

      </div>

    </div>
  );
}

export default CourseCard;