// src/components/Quiz.jsx
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
        // Giả sử questions được trả về trong quiz hoặc cần fetch riêng
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
    setSelected((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    setLoading(true);
    setError("");

    try {
      // Chuẩn bị dữ liệu submit
      const attemptData = {
        selectedAnswers: questions.map(
          (q) => selected[q.id || q._id] ?? -1
        ),
        durationSeconds: 0, // Có thể tính thời gian nếu cần
      };

      const res = await submitQuizAttempt(quiz.id || quiz._id, attemptData);
      setScore(res.data.score);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      const errorMessage =
        err.response?.data?.message || "Nộp bài thất bại. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !quiz) {
    return <div className="quiz">Đang tải bài quiz...</div>;
  }

  if (!quiz || questions.length === 0) {
    return null; // Không hiển thị quiz nếu không có
  }

  const correctCount =
    score !== null
      ? Math.round((score / 100) * questions.length)
      : 0;

  return (
    <div className="quiz">
      <h3 className="quiz-title">Quiz cho bài giảng</h3>

      {error && <p className="quiz-error">{error}</p>}

      {questions.map((q) => (
        <div key={q.id || q._id} className="quiz-question">
          <p className="quiz-question-text">{q.questionText}</p>
          {q.options &&
            q.options.map((opt, idx) => (
              <label key={idx} className="quiz-option">
                <input
                  type="radio"
                  name={`q-${q.id || q._id}`}
                  checked={selected[q.id || q._id] === idx}
                  onChange={() => handleSelect(q.id || q._id, idx)}
                  disabled={submitted}
                />
                <span>{opt}</span>
              </label>
            ))}
        </div>
      ))}

      {!submitted && (
        <button
          className="btn-primary quiz-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang nộp..." : "Nộp bài"}
        </button>
      )}

      {submitted && score !== null && (
        <p className="quiz-result">
          Bạn đúng {correctCount}/{questions.length} câu (Điểm: {score}%)
        </p>
      )}
    </div>
  );
}

export default Quiz;