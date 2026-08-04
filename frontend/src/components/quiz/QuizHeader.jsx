// src/components/quiz/QuizHeader.jsx
function QuizHeader({ title, description, totalQuestions, passingScore }) {
  return (
    <header className="quiz-header">
      <div className="quiz-header-main">
        <h2 className="quiz-title">
          {title || "Java Core Quiz"}
        </h2>
        {description && (
          <p className="quiz-subtitle">
            {description}
          </p>
        )}
      </div>

      <div className="quiz-header-meta">
        <span className="quiz-meta-item">
          Lesson • {totalQuestions} Questions
        </span>
        <span className="quiz-meta-item">
          Passing Score {passingScore}% 
        </span>
      </div>
    </header>
  );
}

export default QuizHeader;