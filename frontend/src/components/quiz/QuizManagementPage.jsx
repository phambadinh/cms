import { useEffect, useMemo, useState } from "react";
import { Edit3, PlusCircle, Save, Trash2, X } from "lucide-react";
import {
  addQuestion,
  createQuiz,
  deleteQuestion,
  deleteQuiz,
  getLessonsByCourse,
  getQuizzesByCourse,
  publishQuiz,
  unpublishQuiz,
  updateQuestion,
  updateQuiz,
} from "../../services/api";
import "../../styles/mentorDashboard.css";

const emptyQuiz = { courseId: "", lessonId: "", title: "", description: "", passingScore: 70 };
const emptyQuestion = { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0, orderNumber: 1, explanation: "" };

function QuizManagementPage({ loadCourses, roleLabel }) {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState(emptyQuiz);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const courseMap = useMemo(() => Object.fromEntries(courses.map((course) => [course.id, course])), [courses]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const courseResponse = await loadCourses();
      const courseList = courseResponse.data || [];
      setCourses(courseList);
      const results = await Promise.all(courseList.map(async (course) => {
        const [lessonResponse, quizResponse] = await Promise.all([
          getLessonsByCourse(course.id),
          getQuizzesByCourse(course.id),
        ]);
        return {
          lessons: (lessonResponse.data || []).map((lesson) => ({ ...lesson, courseName: course.name })),
          quizzes: (quizResponse.data || []).map((quiz) => ({ ...quiz, courseName: course.name })),
        };
      }));
      setLessons(results.flatMap((item) => item.lessons));
      setQuizzes(results.flatMap((item) => item.quizzes));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể tải dữ liệu quiz.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizForm({
      courseId: quiz.courseId,
      lessonId: quiz.lessonId,
      title: quiz.title || "",
      description: quiz.description || "",
      passingScore: quiz.passingScore ?? 70,
    });
    setEditingQuestion(null);
    setQuestionForm(emptyQuestion);
  };

  const openNewQuiz = () => {
    const courseId = courses[0]?.id || "";
    setSelectedQuiz(null);
    setQuizForm({ ...emptyQuiz, courseId, lessonId: lessons.find((lesson) => lesson.courseId === courseId)?.id || "" });
  };

  const saveQuiz = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (selectedQuiz) await updateQuiz(selectedQuiz.id, quizForm);
      else await createQuiz(quizForm.lessonId, quizForm);
      await loadData();
      setSelectedQuiz(null);
      setQuizForm(emptyQuiz);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể lưu quiz.");
    } finally {
      setSaving(false);
    }
  };

  const saveQuestion = async (event) => {
    event.preventDefault();
    if (!selectedQuiz) return;
    try {
      setSaving(true);
      const payload = { ...questionForm, options: questionForm.options.filter(Boolean), correctAnswerIndex: Number(questionForm.correctAnswerIndex), orderNumber: Number(questionForm.orderNumber) };
      if (editingQuestion) await updateQuestion(editingQuestion.id, payload);
      else await addQuestion(selectedQuiz.id, payload);
      const refreshed = (await getQuizzesByCourse(selectedQuiz.courseId)).data || [];
      const current = refreshed.find((quiz) => quiz.id === selectedQuiz.id);
      setSelectedQuiz(current ? { ...current, courseName: selectedQuiz.courseName } : selectedQuiz);
      setQuizzes((items) => items.map((quiz) => quiz.id === selectedQuiz.id ? { ...quiz, ...(current || {}) } : quiz));
      setEditingQuestion(null);
      setQuestionForm({ ...emptyQuestion, orderNumber: (current?.questions?.length || 0) + 1 });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể lưu câu hỏi.");
    } finally {
      setSaving(false);
    }
  };

  const removeQuestion = async (questionId) => {
    if (!window.confirm("Xóa câu hỏi này?")) return;
    await deleteQuestion(questionId);
    const refreshed = (await getQuizzesByCourse(selectedQuiz.courseId)).data || [];
    setSelectedQuiz(refreshed.find((quiz) => quiz.id === selectedQuiz.id) || selectedQuiz);
  };

  const removeQuiz = async (quizId) => {
    if (!window.confirm("Xóa quiz này và toàn bộ câu hỏi?")) return;
    await deleteQuiz(quizId);
    setSelectedQuiz(null);
    await loadData();
  };

  const selectedLessons = lessons.filter((lesson) => lesson.courseId === quizForm.courseId);

  return (
    <div className="mentor-page-shell">
      <div className="mentor-page-header">
        <div><span className="mentor-eyebrow">{roleLabel} / QUIZ</span><h1 className="mentor-title">Quản lý quiz</h1><p className="mentor-subtitle">Tạo bài kiểm tra, câu hỏi, đáp án và trạng thái công bố theo từng bài học.</p></div>
        <div className="mentor-page-actions"><button type="button" className="mentor-button is-primary" onClick={openNewQuiz}><PlusCircle size={16} />Tạo quiz</button></div>
      </div>

      {error && <div className="mentor-error" role="alert">{error}</div>}
      {loading ? <div className="mentor-loading">Đang tải danh sách quiz...</div> : (
        <section className="mentor-panel">
          <div className="mentor-panel-header"><h2 className="mentor-panel-title">Danh sách quiz</h2><span className="mentor-panel-count">{quizzes.length} quiz</span></div>
          <div className="mentor-table-wrap"><table className="mentor-table"><thead><tr><th>Tiêu đề</th><th>Khóa học</th><th>Điểm đạt</th><th>Trạng thái</th><th>Hành động</th></tr></thead><tbody>
            {quizzes.map((quiz) => <tr key={quiz.id}><td>{quiz.title}</td><td>{courseMap[quiz.courseId]?.name || quiz.courseName || "-"}</td><td>{quiz.passingScore}%</td><td>{quiz.published ? "Đã đăng" : "Nháp"}</td><td><div className="mentor-table-actions"><button type="button" className="mentor-button is-ghost" onClick={() => openQuiz(quiz)}><Edit3 size={14} />Sửa</button><button type="button" className="mentor-button is-secondary" onClick={async () => { if (quiz.published) await unpublishQuiz(quiz.id); else await publishQuiz(quiz.id); await loadData(); }}>{quiz.published ? "Hủy đăng" : "Đăng"}</button><button type="button" className="mentor-button is-danger" onClick={() => removeQuiz(quiz.id)}><Trash2 size={14} />Xóa</button></div></td></tr>)}
            {!quizzes.length && <tr><td colSpan={5}>Chưa có quiz.</td></tr>}
          </tbody></table></div>
        </section>
      )}

      {(selectedQuiz || quizForm.courseId) && <div className="mentor-modal-backdrop" role="presentation"><form className="mentor-modal" onSubmit={saveQuiz}><div className="mentor-modal-header"><h2>{selectedQuiz ? "Sửa quiz" : "Tạo quiz"}</h2><button type="button" className="mentor-icon-button" onClick={() => { setSelectedQuiz(null); setQuizForm(emptyQuiz); }} aria-label="Đóng"><X size={18} /></button></div><div className="mentor-form-grid">
        <label>Khóa học<select required disabled={Boolean(selectedQuiz)} value={quizForm.courseId} onChange={(event) => setQuizForm({ ...quizForm, courseId: event.target.value, lessonId: "" })}>{courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}</select></label>
        <label>Bài học<select required disabled={Boolean(selectedQuiz)} value={quizForm.lessonId} onChange={(event) => setQuizForm({ ...quizForm, lessonId: event.target.value })}>{selectedLessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select></label>
        <label className="mentor-form-full">Tiêu đề<input required value={quizForm.title} onChange={(event) => setQuizForm({ ...quizForm, title: event.target.value })} /></label>
        <label>Điểm đạt<input type="number" min="0" max="100" required value={quizForm.passingScore} onChange={(event) => setQuizForm({ ...quizForm, passingScore: Number(event.target.value) })} /></label>
        <label className="mentor-form-full">Mô tả<textarea rows="3" value={quizForm.description} onChange={(event) => setQuizForm({ ...quizForm, description: event.target.value })} /></label>
      </div><div className="mentor-modal-actions"><button type="button" className="mentor-button is-secondary" onClick={() => { setSelectedQuiz(null); setQuizForm(emptyQuiz); }}>Hủy</button><button type="submit" className="mentor-button is-primary" disabled={saving}><Save size={15} />Lưu quiz</button></div></form>
      {selectedQuiz && <form className="mentor-modal" onSubmit={saveQuestion}><div className="mentor-modal-header"><h2>Câu hỏi: {selectedQuiz.title}</h2></div><div className="mentor-form-grid"><label className="mentor-form-full">Nội dung<input required value={questionForm.questionText} onChange={(event) => setQuestionForm({ ...questionForm, questionText: event.target.value })} /></label>{questionForm.options.map((option, index) => <label key={index}>Đáp án {index + 1}<input required={index < 2} value={option} onChange={(event) => { const options = [...questionForm.options]; options[index] = event.target.value; setQuestionForm({ ...questionForm, options }); }} /></label>)}<label>Đáp án đúng (số thứ tự)<input type="number" min="0" max={questionForm.options.length - 1} required value={questionForm.correctAnswerIndex} onChange={(event) => setQuestionForm({ ...questionForm, correctAnswerIndex: event.target.value })} /></label><label>Thứ tự<input type="number" min="1" required value={questionForm.orderNumber} onChange={(event) => setQuestionForm({ ...questionForm, orderNumber: event.target.value })} /></label><label className="mentor-form-full">Giải thích<textarea rows="2" value={questionForm.explanation} onChange={(event) => setQuestionForm({ ...questionForm, explanation: event.target.value })} /></label></div><div className="mentor-modal-actions"><button type="submit" className="mentor-button is-primary" disabled={saving}><Save size={15} />{editingQuestion ? "Cập nhật câu hỏi" : "Thêm câu hỏi"}</button></div><div className="mentor-table-wrap"><table className="mentor-table"><tbody>{(selectedQuiz.questions || []).map((question) => <tr key={question.id}><td>{question.orderNumber}. {question.questionText}</td><td>Đáp án: {Number(question.correctAnswerIndex) + 1}</td><td><button type="button" className="mentor-button is-danger" onClick={() => removeQuestion(question.id)}><Trash2 size={14} />Xóa</button></td></tr>)}</tbody></table></div></form>}
      </div>}
    </div>
  );
}

export default QuizManagementPage;