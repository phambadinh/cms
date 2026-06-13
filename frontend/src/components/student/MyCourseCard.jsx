// src/components/student/MyCourseCard.jsx

import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MyCourseCard({
  course,
  onContinueLearning,
}) {
  const navigate = useNavigate();

  const handleContinue = () => {
    if (onContinueLearning) {
      onContinueLearning(course.id);
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  return (
    <div className="my-course-card">

      <div className="my-course-thumbnail">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.name}
          />
        ) : (
          <div className="my-course-placeholder">
            <BookOpen size={60} />
          </div>
        )}
      </div>

      <div className="my-course-body">

        <h3 className="my-course-title">
          {course.name}
        </h3>

        <p className="my-course-level">
          {course.level || "Beginner"}
        </p>

        <div className="progress-wrapper">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  course.progressPercentage || 0
                }%`,
              }}
            />
          </div>

          <span>
            {course.progressPercentage || 0}%
          </span>
        </div>

        <button
          className="continue-btn"
          onClick={handleContinue}
        >
          Tiếp tục học
        </button>

      </div>

    </div>
  );
}

export default MyCourseCard;