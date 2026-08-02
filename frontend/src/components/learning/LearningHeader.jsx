// src/components/learning/LearningHeader.jsx
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LearningHeader({ courseName }) {
  const navigate = useNavigate();

  return (
    <header className="learning-header">
      <button
        type="button"
        className="learning-back-btn"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        <span>Quay lại khóa học</span>
      </button>

      <div className="learning-course-title">
        <h2>{courseName}</h2>
        <p>Chế độ học tập</p>
      </div>
    </header>
  );
}

export default LearningHeader;