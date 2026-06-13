import {
  Users,
  Star,
  BookOpen,
  ArrowRight,
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

      <img
        src={getImage()}
        alt={course.name}
        className="course-image"
      />

      <div className="course-body">

        <span className="course-tag">
          {course.level || "Beginner"}
        </span>

        <h3>{course.name}</h3>

        <div className="course-stats">

          <span>
            <Users size={14} />
            100
          </span>

          <span>
            <Star size={14} />
            4.8
          </span>

          <span>
            <BookOpen size={14} />
            {course.totalLessons || 0}
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
            <ArrowRight size={14} />
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
              : "Ghi danh"}
          </button>
        )}

      </div>

    </div>
  );
}

export default CourseCard;