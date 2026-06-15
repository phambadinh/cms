
import { useEffect, useState } from "react";
import { getQuizByLesson, submitQuizAttempt } from "../services/api";
import "../styles/quiz.css";

function Quiz({ lessonId }) {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!lessonId) return;

      setLoading(true);
      setError("");

      try {
        const res = await getQuizByLesson(lessonId);

        const quizData = res.data;

        setQuiz(quizData);
        setQuestions(quizData.questions || []);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Không thể tải bài quiz. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [lessonId]);

  const handleSelect = (questionId, optionIndex) => {
    if (submitted) return;

    setSelected((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    setLoading(true);
    setError("");

    try {
      const attemptData = {
        selectedAnswers: questions.map(
          (q) => selected[q.id || q._id] ?? -1
        ),
        durationSeconds: 0,
      };

      const res = await submitQuizAttempt(
        quiz.id || quiz._id,
        attemptData
      );

      setScore(res.data.score);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);

      const errorMessage =
        err.response?.data?.message ||
        "Nộp bài thất bại. Vui lòng thử lại.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !quiz) {
    return (
      <div className="quiz-loading">
        Đang tải bài quiz...
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return null;
  }

  const correctCount =
    score !== null
      ? Math.round((score / 100) * questions.length)
      : 0;

  const answeredCount =
    Object.keys(selected).length;

  const scoreClass =
    score >= 80
      ? "excellent"
      : score >= 50
      ? "good"
      : "bad";

  return (
    <div className="quiz">
      <h3 className="quiz-title">
        Quiz kiểm tra kiến thức
      </h3>

      {!submitted && (
        <div className="quiz-progress">
          Đã trả lời {answeredCount}/{questions.length} câu hỏi
        </div>
      )}

      {error && (
        <div className="quiz-error">
          {error}
        </div>
      )}

      {questions.map((q, index) => (
        <div
          key={q.id || q._id}
          className="quiz-question"
        >
          <p className="quiz-question-text">
            {index + 1}. {q.questionText}
          </p>

          {q.options?.map((opt, idx) => (
            <label
              key={idx}
              className={`quiz-option ${
                selected[q.id || q._id] === idx
                  ? "selected"
                  : ""
              }`}
            >
              <input
                type="radio"
                name={`q-${q.id || q._id}`}
                checked={
                  selected[q.id || q._id] === idx
                }
                onChange={() =>
                  handleSelect(
                    q.id || q._id,
                    idx
                  )
                }
                disabled={submitted}
              />

              <span>{opt}</span>
            </label>
          ))}
        </div>
      ))}

      {!submitted && (
        <button
          className="quiz-submit"
          onClick={handleSubmit}
          disabled={
            loading ||
            answeredCount !== questions.length
          }
        >
          {loading
            ? "Đang nộp bài..."
            : "🚀 Nộp bài"}
        </button>
      )}

      {submitted && score !== null && (
        <div
          className={`quiz-score ${scoreClass}`}
        >
          <h3>{score}%</h3>

          <p>
            Bạn trả lời đúng{" "}
            <strong>
              {correctCount}/
              {questions.length}
            </strong>{" "}
            câu hỏi
          </p>

          <p>
            {score >= 80
              ? "🎉 Xuất sắc!"
              : score >= 50
              ? "👍 Khá tốt!"
              : "📚 Hãy ôn tập thêm nhé!"}
          </p>
        </div>
      )}
    </div>
  );
}

export default Quiz;
