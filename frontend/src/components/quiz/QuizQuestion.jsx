// src/components/quiz/QuizQuestion.jsx
function QuizQuestion({ index, question, selectedOptionIndex, disabled, onSelect }) {
  if (!question) return null;

  const qId = question.id || question._id;

  return (
    <section className="quiz-question-card">
      <h3 className="quiz-question-title">
        Question {index + 1}
      </h3>
      <p className="quiz-question-text">
        {question.questionText}
      </p>

      <div className="quiz-options">
        {question.options?.map((opt, idx) => {
          const isSelected = selectedOptionIndex === idx;

          return (
            <button
              key={idx}
              type="button"
              className={`quiz-option-pill ${
                isSelected ? "quiz-option-pill-selected" : ""
              } ${disabled ? "quiz-option-pill-disabled" : ""}`}
              onClick={() => onSelect(qId, idx)}
              disabled={disabled}
            >
              <span className="quiz-option-letter">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="quiz-option-text">
                {opt}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default QuizQuestion;