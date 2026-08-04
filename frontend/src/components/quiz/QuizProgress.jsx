// src/components/quiz/QuizProgress.jsx
function QuizProgress({ currentIndex, totalQuestions, answeredCount }) {
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="quiz-progress">
      <div className="quiz-progress-top">
        <span>
          Question {currentIndex + 1} / {totalQuestions}
        </span>
        <span>
          Đã trả lời {answeredCount}/{totalQuestions}
        </span>
      </div>

      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

export default QuizProgress;