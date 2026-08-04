import { useEffect, useState } from "react";
import { getQuizByLesson, submitQuizAttempt } from "../../services/api";

import QuizHeader from "../quiz/QuizHeader";
import QuizProgress from "../quiz/QuizProgress";
import QuizQuestion from "../quiz/QuizQuestion";
import QuizNavigation from "../quiz/QuizNavigation";
import QuizResult from "../quiz/QuizResult";

import "../../styles/quiz.css";

function QuizPage({ lessonId }) {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [resultStatus, setResultStatus] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!lessonId) return;

      setLoading(true);
      setError("");

      try {
        const res = await getQuizByLesson(lessonId);
        const quizData = res.data;

        setQuiz(quizData || null);
        setQuestions(quizData?.questions || []);
        setSelected({});
        setSubmitted(false);
        setScore(null);
        setResultStatus(null);
        setCurrentIndex(0);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Không thể tải bài kiểm tra. Vui lòng thử lại.");
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

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleSubmit = async () => {
    if (!quiz || questions.length === 0) return;

    const answeredCount = Object.keys(selected).length;
    if (answeredCount !== questions.length) {
      setError("Bạn cần trả lời hết tất cả câu hỏi trước khi nộp bài.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const attemptData = {
        quizId: quiz.id || quiz._id,
        selectedAnswers: questions.map((q) => {
          const qId = q.id || q._id;
          return selected[qId] ?? -1;
        }),
        durationSeconds: 0,
      };

      const response = await submitQuizAttempt(attemptData);
      const data = response.data || {};

      const scorePercentage = data.scorePercentage ?? data.score ?? 0;

      setScore(scorePercentage);

      const passingScore = quiz.passingScore ?? quiz.passingPercentage ?? 70;
      setResultStatus(scorePercentage >= passingScore ? "PASS" : "FAIL");

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      const errorMessage = err.response?.data?.message || "Nộp bài thất bại. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setSelected({});
    setSubmitted(false);
    setScore(null);
    setResultStatus(null);
    setCurrentIndex(0);
    setError("");
  };

  if (loading && !quiz) {
    return <div className="quiz-loading">Đang tải bài kiểm tra...</div>;
  }

  if (!quiz || questions.length === 0) {
    return <div className="quiz-empty">Không có bài kiểm tra cho bài học này.</div>;
  }

  const answeredCount = Object.keys(selected).length;
  const currentQuestion = questions[currentIndex];
  const qId = currentQuestion?.id || currentQuestion?._id;
  const selectedOptionIndex = selected[qId];

  const passingScore = quiz.passingScore ?? quiz.passingPercentage ?? 70;

  return (
    <div className="quiz-page">
      <QuizHeader
        title={quiz.title}
        description={quiz.description}
        totalQuestions={questions.length}
        passingScore={passingScore}
      />

      {!submitted && (
        <QuizProgress
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          answeredCount={answeredCount}
        />
      )}

      {error && <div className="quiz-error">{error}</div>}

      <QuizQuestion
        index={currentIndex}
        question={currentQuestion}
        selectedOptionIndex={selectedOptionIndex}
        disabled={submitted}
        onSelect={handleSelect}
      />

      {!submitted && (
        <QuizNavigation
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          answeredCount={answeredCount}
          loading={loading}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      )}

      {submitted && <QuizResult score={score} resultStatus={resultStatus} onRetake={handleRetake} />}
    </div>
  );
}

export default QuizPage;