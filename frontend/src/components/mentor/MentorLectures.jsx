// src/components/mentor/MentorLectures.jsx
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Clock3, Edit3, Library, PlusCircle, Trash2, X } from "lucide-react";
import {
  createLesson,
  deleteLesson,
  getLessonsByCourse,
  getMyCreatedCourses,
  publishLesson,
  unpublishLesson,
  updateLesson,
} from "../../services/api";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import Badge from "./Badge";
import { formatDuration } from "../../utils/mentorFormatters";
import "../../styles/mentorDashboard.css";

function MentorLectures() {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [form, setForm] = useState({ courseId: "", title: "", description: "", videoUrl: "", duration: "", orderNumber: "1" });
  const [busyLessonId, setBusyLessonId] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const coursesResponse = await getMyCreatedCourses();
      const courseList = coursesResponse.data || [];
      setCourses(courseList);

      const lessonResults = await Promise.all(
        courseList.map(async (course) => {
          try {
            const response = await getLessonsByCourse(course.id);
            return (response.data || []).map((lesson) => ({ ...lesson, courseName: course.name }));
          } catch (err) {
            console.error(`Không tải được bài giảng của khóa ${course.name}:`, err);
            return [];
          }
        })
      );

      setLessons(lessonResults.flat().sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)));
      setError("");
    } catch (err) {
      console.error("Không tải được dữ liệu bài giảng:", err);
      setError("Không thể tải danh sách bài giảng của bạn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateForm = () => {
    setEditingLesson(null);
    setForm({ courseId: courses[0]?.id || "", title: "", description: "", videoUrl: "", duration: "", orderNumber: String(lessons.length + 1) });
    setShowForm(true);
  };

  const openEditForm = (lesson) => {
    setEditingLesson(lesson);
    setForm({ courseId: lesson.courseId, title: lesson.title || "", description: lesson.description || "", videoUrl: lesson.videoUrl || "", duration: lesson.duration ?? "", orderNumber: lesson.orderNumber ?? "1" });
    setShowForm(true);
  };

  const handleSaveLesson = async (event) => {
    event.preventDefault();
    try {
      setBusyLessonId("form");
      const payload = { ...form, duration: Number(form.duration || 0), orderNumber: Number(form.orderNumber || 1) };
      if (editingLesson) await updateLesson(editingLesson.id, payload);
      else await createLesson(form.courseId, payload);
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lưu bài giảng.");
    } finally {
      setBusyLessonId("");
    }
  };

  const handleTogglePublish = async (lesson) => {
    try {
      setBusyLessonId(lesson.id);
      if (lesson.published) await unpublishLesson(lesson.id);
      else await publishLesson(lesson.id);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể thay đổi trạng thái bài giảng.");
    } finally {
      setBusyLessonId("");
    }
  };

  const handleDeleteLesson = async (lesson) => {
    if (!window.confirm(`Xóa bài giảng ${lesson.title}?`)) return;
    try {
      setBusyLessonId(lesson.id);
      await deleteLesson(lesson.id);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể xóa bài giảng.");
    } finally {
      setBusyLessonId("");
    }
  };

  const stats = useMemo(() => {
    const published = lessons.filter((l) => l.published).length;
    const totalDuration = lessons.reduce((sum, l) => sum + (l.duration || 0), 0);
    return { totalCourses: courses.length, totalLessons: lessons.length, published, totalDuration };
  }, [courses, lessons]);

  return (
    <div className="mentor-page-shell">
      <PageHeader
        eyebrow="MENTOR / BÀI GIẢNG"
        title="Bài giảng của tôi"
        subtitle="Theo dõi các bài giảng theo từng khóa học, trạng thái hiển thị và thời lượng nội dung."
        onReload={loadData}
        reloading={loading}
        actions={<button className="mentor-button is-primary" type="button" onClick={openCreateForm} disabled={courses.length === 0}><PlusCircle size={16} />Tạo bài giảng</button>}
      />

      <div className="mentor-stats-grid">
        <StatCard icon={BookOpen} label="Khóa có bài giảng" value={stats.totalCourses} note="Tổng số khóa bạn đang quản lý" />
        <StatCard icon={Library} label="Tổng bài giảng" value={stats.totalLessons} note="Số bài giảng đã tạo" tone="blue" />
        <StatCard icon={Clock3} label="Đã công bố" value={stats.published} note="Bài giảng đang hiển thị cho học viên" tone="green" />
        <StatCard icon={Clock3} label="Tổng thời lượng" value={formatDuration(stats.totalDuration)} note="Tổng thời lượng toàn bộ bài giảng" tone="amber" />
      </div>

      {loading ? (
        <LoadingState label="Đang tải danh sách bài giảng..." />
      ) : error ? (
        <div className="mentor-error" role="alert">{error}</div>
      ) : lessons.length === 0 ? (
        <EmptyState icon={Library} title="Bạn chưa có bài giảng nào." />
      ) : (
        <section className="mentor-panel">
          <div className="mentor-panel-header">
            <div className="mentor-panel-title-row">
              <Library size={18} strokeWidth={2} aria-hidden="true" />
              <h2 className="mentor-panel-title">Danh sách bài giảng</h2>
            </div>
            <span className="mentor-panel-count">{lessons.length} bài</span>
          </div>

          <div className="mentor-table-wrap">
            <table className="mentor-table">
              <thead>
                <tr>
                  <th>Bài giảng</th>
                  <th>Khóa học</th>
                  <th>Thứ tự</th>
                  <th>Thời lượng</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.id || lesson._id}>
                    <td className="mentor-course-name">{lesson.title}</td>
                    <td>{lesson.courseName}</td>
                    <td>{lesson.orderNumber ?? 0}</td>
                    <td>{formatDuration(lesson.duration)}</td>
                    <td>
                      <Badge tone={lesson.published ? "live" : "draft"}>
                        {lesson.published ? "Đã đăng" : "Nháp"}
                      </Badge>
                    </td>
                    <td>
                      <div className="mentor-table-actions">
                        <button type="button" className="mentor-button is-ghost" onClick={() => openEditForm(lesson)}><Edit3 size={14} />Sửa</button>
                        <button type="button" className="mentor-button is-secondary" onClick={() => handleTogglePublish(lesson)} disabled={busyLessonId === lesson.id}>{lesson.published ? "Hủy đăng" : "Đăng"}</button>
                        <button type="button" className="mentor-button is-danger" onClick={() => handleDeleteLesson(lesson)} disabled={busyLessonId === lesson.id}><Trash2 size={14} />Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {showForm && (
        <div className="mentor-modal-backdrop" role="presentation">
          <form className="mentor-modal" onSubmit={handleSaveLesson}>
            <div className="mentor-modal-header">
              <h2>{editingLesson ? "Sửa bài giảng" : "Tạo bài giảng"}</h2>
              <button type="button" className="mentor-icon-button" onClick={() => setShowForm(false)} aria-label="Đóng"><X size={18} /></button>
            </div>
            <div className="mentor-form-grid">
              <label>Khóa học<select required disabled={Boolean(editingLesson)} value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>{courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}</select></label>
              <label>Thứ tự<input type="number" min="1" required value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} /></label>
              <label className="mentor-form-full">Tiêu đề<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
              <label className="mentor-form-full">URL video<input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} /></label>
              <label>Thời lượng (phút)<input type="number" min="0" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></label>
              <label className="mentor-form-full">Mô tả<textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            </div>
            <div className="mentor-modal-actions"><button type="button" className="mentor-button is-secondary" onClick={() => setShowForm(false)}>Hủy</button><button type="submit" className="mentor-button is-primary" disabled={busyLessonId === "form"}>{busyLessonId === "form" ? "Đang lưu..." : "Lưu bài giảng"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

export default MentorLectures;