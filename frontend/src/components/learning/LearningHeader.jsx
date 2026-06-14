// src/components/learning/LearningHeader.jsx

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LearningHeader({
  courseName,
}) {
  const navigate =
    useNavigate();

  return (
    <header className="learning-header">

      <button
        onClick={() =>
          navigate(-1)
        }
      >
        <ArrowLeft size={18} />
      </button>

      <h2>{courseName}</h2>

    </header>
  );
}

export default LearningHeader;