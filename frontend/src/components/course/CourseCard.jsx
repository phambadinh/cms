import {
  Users,
  Star,
  BookOpen,
  ArrowRight,
  Clock,
} from "lucide-react";

import htmlImg from "./html.png";
import cssImg from "./css.png";
import javaImg from "./java.png";

function CourseCard({
  course,
  onView,
  onEnroll,
  loading,
}) {
  const getImage = () => {
    const name = (course.name || "").toLowerCase();

    if (name.includes("html")) return htmlImg;
    if (name.includes("css")) return cssImg;
    if (name.includes("java")) return javaImg;

    return htmlImg;
  };

  return (
    <div className="course-card">

      <div className="course-image-wrapper">
        <img
          src={getImage()}
          alt={course.name}
          className="course-image"
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
            100+
          </span>

          <span>
            <Star size={14} />
            4.8
          </span>

          <span>
            <BookOpen size={14} />
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
              ? "Đang ghi danh..."
              : "Ghi danh ngay"}
          </button>
        )}

      </div>

    </div>
  );
}

export default CourseCard;