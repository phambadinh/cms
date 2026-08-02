// src/components/quiz/QuizResult.jsx
import { Award, BookOpen, ThumbsUp } from "lucide-react";

function QuizResult({ score, resultStatus, onRetake }) {
  if (score === null || score === undefined) return null;

  const scoreClass =
    score >= 90
      ? "excellent"
      : score >= 70
      ? "good"
      : "bad";

  const ratingText =
    score >= 90
      ? "Excellent"
      : score >= 70
      ? "Good"
      : "Need Improvement";

  const icon =
    score >= 90
      ? <Award size={18} />
      : score >= 70
      ? <ThumbsUp size={18} />
      : <BookOpen size={18} />;

  return (
    <section className="quiz-result">
      <h3>Your Score</h3>

      <div className={`quiz-score-card ${scoreClass}`}>
        <div className="quiz-score-main">
          <span className="quiz-score-percent">
            {score}%
          </span>
          <span className="quiz-score-rating">
            {ratingText}
          </span>
        </div>

        <div className="quiz-score-detail">
          <span className="quiz-score-status">
            {resultStatus === "PASS" ? "PASS" : "FAIL"}
          </span>
          <span className="quiz-score-extra">
            {icon}
            <span className="quiz-score-message">
              {score >= 90
                ? "Xuất sắc!"
                : score >= 70
                ? "Khá tốt!"
                : "Hãy ôn tập thêm nhé!"}
            </span>
          </span>
        </div>
      </div>

      <div className="quiz-result-actions">
        <button
          type="button"
          className="quiz-nav-btn primary"
          onClick={onRetake}
        >
          Retake Quiz
        </button>
      </div>
    </section>
  );
}

export default QuizResult;