// src/components/mentor/MentorGrades.jsx
// NOTE: cần hàm getGradesByCourse(courseId) trong services/api.js
import { useEffect, useMemo, useState } from "react";
import { Award, BookOpen, CheckCircle2, Edit3, PlusCircle, Users, X } from "lucide-react";
import { createGrade, getEnrollmentsByCourse, getGradesByCourse, getMyCreatedCourses, updateGrade } from "../../services/api";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import Badge from "./Badge";
import { average, studentLabel } from "../../utils/mentorFormatters";
import "../../styles/mentorDashboard.css";

const PASS_THRESHOLD = 5;

function MentorGrades() {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [form, setForm] = useState({ courseId: "", userId: "", score: "" });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const coursesRes = await getMyCreatedCourses();
      const courseList = coursesRes.data || [];
      setCourses(courseList);

      const results = await Promise.all(
        courseList.map(async (course) => {
          try {
            const res = await getGradesByCourse(course.id);
            return (res.data || []).map((g) => ({ ...g, courseName: course.name }));
          } catch (err) {
            console.error(`Không tải được điểm của khóa ${course.name}:`, err);
            return [];
          }
        })
      );

      setGrades(results.flat());
      const enrollmentResults = await Promise.all(courseList.map(async (course) => {
        const response = await getEnrollmentsByCourse(course.id);
        return (response.data || []).map((item) => ({ ...item, courseId: course.id, courseName: course.name }));
      }));
      setStudents(enrollmentResults.flat());
      setError("");
    } catch (err) {
      console.error("Không tải được điểm số:", err);
      setError("Không thể tải điểm số lớp học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateForm = () => {
    const courseId = courses[0]?.id || "";
    setEditingGrade(null);
    setForm({ courseId, userId: students.find((student) => student.courseId === courseId)?.userId || "", score: "" });
    setShowForm(true);
  };

  const openEditForm = (grade) => {
    setEditingGrade(grade);
    setForm({ courseId: grade.courseId, userId: grade.userId, score: grade.score ?? "" });
    setShowForm(true);
  };

  const handleSaveGrade = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (editingGrade) await updateGrade(editingGrade.id, Number(form.score));
      else await createGrade(form.userId, form.courseId, Number(form.score));
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lưu điểm.");
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => {
    const scoredCourses = new Set(grades.map((g) => g.courseName)).size;
    const passed = grades.filter((g) => Number(g.score || 0) >= PASS_THRESHOLD).length;
    const avgScore = average(grades.map((g) => Number(g.score || 0)));
    const uniqueStudents = new Set(grades.map((g) => g.userId)).size;
    return { scoredCourses, passed, avgScore, uniqueStudents };
  }, [grades]);

  return (
    <div className="mentor-page-shell">
      <PageHeader
        eyebrow="MENTOR / ĐIỂM SỐ"
        title="Điểm số lớp học"
        subtitle="Theo dõi kết quả học viên theo từng khóa học và cập nhật điểm chấm nhanh hơn."
        onReload={loadData}
        reloading={loading}
        actions={<button className="mentor-button is-primary" type="button" onClick={openCreateForm} disabled={!students.length}><PlusCircle size={16} />Nhập điểm</button>}
      />

      <div className="mentor-stats-grid">
        <StatCard icon={BookOpen} label="Khóa có điểm" value={stats.scoredCourses} note="Số khóa học đã có điểm" />
        <StatCard icon={CheckCircle2} label="Học viên đạt" value={stats.passed} note={`Điểm ≥ ${PASS_THRESHOLD}`} tone="green" />
        <StatCard icon={Award} label="Điểm trung bình" value={stats.avgScore.toFixed(1)} note="Trung bình toàn bộ bài chấm" tone="amber" />
        <StatCard icon={Users} label="Học viên riêng" value={stats.uniqueStudents} note="Số học viên có điểm ghi nhận" tone="blue" />
      </div>

      {loading ? (
        <LoadingState label="Đang tải điểm số..." />
      ) : error ? (
        <div className="mentor-error" role="alert">{error}</div>
      ) : grades.length === 0 ? (
        <EmptyState
          icon={Award}
          title="Chưa có điểm nào"
          description="Điểm số của học viên sẽ xuất hiện ở đây sau khi bạn chấm hoặc cập nhật kết quả học tập."
        />
      ) : (
        <section className="mentor-panel">
          <div className="mentor-panel-header">
            <div className="mentor-panel-title-row">
              <Award size={18} strokeWidth={2} aria-hidden="true" />
              <h2 className="mentor-panel-title">Bảng điểm</h2>
            </div>
            <span className="mentor-panel-count">{grades.length} bản ghi</span>
          </div>

          <div className="mentor-table-wrap">
            <table className="mentor-table">
              <thead>
                <tr>
                  <th>Học viên</th>
                  <th>Khóa học</th>
                  <th>Bài kiểm tra</th>
                  <th>Điểm</th>
                  <th>Kết quả</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => (
                  <tr key={g.id || `${g.userId}-${g.courseName}-${g.quizTitle}`}>
                    <td className="mentor-course-name">{studentLabel(g)}</td>
                    <td>{g.courseName}</td>
                    <td>{g.quizTitle || "—"}</td>
                    <td>{Number(g.score || 0).toFixed(1)}</td>
                    <td>
                      <Badge tone={Number(g.score || 0) >= PASS_THRESHOLD ? "completed" : "danger"}>
                        {Number(g.score || 0) >= PASS_THRESHOLD ? "Đạt" : "Chưa đạt"}
                      </Badge>
                    </td>
                    <td><button type="button" className="mentor-button is-ghost" onClick={() => openEditForm(g)}><Edit3 size={14} />Sửa điểm</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {showForm && (
        <div className="mentor-modal-backdrop" role="presentation">
          <form className="mentor-modal" onSubmit={handleSaveGrade}>
            <div className="mentor-modal-header"><h2>{editingGrade ? "Sửa điểm" : "Nhập điểm"}</h2><button type="button" className="mentor-icon-button" onClick={() => setShowForm(false)} aria-label="Đóng"><X size={18} /></button></div>
            <div className="mentor-form-grid">
              <label>Khóa học<select required disabled={Boolean(editingGrade)} value={form.courseId} onChange={(e) => { const courseId = e.target.value; setForm({ ...form, courseId, userId: students.find((student) => student.courseId === courseId)?.userId || "" }); }}>{courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}</select></label>
              <label>Học viên<select required disabled={Boolean(editingGrade)} value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })}>{students.filter((student) => student.courseId === form.courseId).map((student) => <option key={student.userId} value={student.userId}>{studentLabel(student)}</option>)}</select></label>
              <label>Điểm số<input required type="number" min="0" max="100" step="0.1" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} /></label>
            </div>
            <div className="mentor-modal-actions"><button type="button" className="mentor-button is-secondary" onClick={() => setShowForm(false)}>Hủy</button><button type="submit" className="mentor-button is-primary" disabled={saving}>{saving ? "Đang lưu..." : "Lưu điểm"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

export default MentorGrades;