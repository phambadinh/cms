// src/components/quiz/QuizNavigation.jsx
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

function QuizNavigation({
  currentIndex,
  totalQuestions,
  answeredCount,
  loading,
  onPrevious,
  onNext,
  onSubmit,
}) {
  const canPrevious = currentIndex > 0;
  const canNext = currentIndex < totalQuestions - 1;

  const canSubmit =
    answeredCount === totalQuestions && !loading;

  return (
    <div className="quiz-navigation">
      <button
        type="button"
        className="quiz-nav-btn secondary"
        onClick={onPrevious}
        disabled={!canPrevious || loading}
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      <button
        type="button"
        className="quiz-nav-btn secondary"
        onClick={onNext}
        disabled={!canNext || loading}
      >
        Next
        <ChevronRight size={18} />
      </button>

      <button
        type="button"
        className="quiz-nav-btn primary"
        onClick={onSubmit}
        disabled={!canSubmit}
      >
        {loading ? (
          "Đang nộp bài..."
        ) : (
          <>
            <Send size={18} />
            Submit
          </>
        )}
      </button>
    </div>
  );
}

export default QuizNavigation;