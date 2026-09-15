// src/components/mentor/MentorCourses.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle2, Clock3, Edit3, PlusCircle, Trash2, Users, X } from "lucide-react";
import {
  createCourse,
  deleteCourse,
  getMyCreatedCourses,
  publishCourse,
  unpublishCourse,
  updateCourse,
} from "../../services/api";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import Badge from "./Badge";
import { formatCourseType } from "../../utils/mentorFormatters";
import "../../styles/mentorDashboard.css";

function MentorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyCourseId, setBusyCourseId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    courseType: "FREE",
    price: "",
    category: "",
    thumbnail: "",
    level: "BEGINNER",
  });
  const navigate = useNavigate();

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await getMyCreatedCourses();
      setCourses(response.data || []);
      setError("");
    } catch (err) {
      console.error("Không tải được danh sách khóa học:", err);
      setError("Không thể tải danh sách khóa học của bạn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const stats = useMemo(() => {
    const published = courses.filter((c) => c.published).length;
    const premium = courses.filter((c) => c.courseType !== "FREE").length;
    const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0);
    return { total: courses.length, published, premium, totalEnrollments };
  }, [courses]);

  const handleTogglePublish = async (course) => {
    try {
      setBusyCourseId(course.id);
      if (course.published) {
        await unpublishCourse(course.id);
      } else {
        await publishCourse(course.id);
      }
      await loadCourses();
    } catch (err) {
      console.error("Không cập nhật được trạng thái xuất bản:", err);
      setError("Không thể thay đổi trạng thái xuất bản của khóa học.");
    } finally {
      setBusyCourseId("");
    }
  };

  const openCreateForm = () => {
    setEditingCourse(null);
    setForm({ code: "", name: "", description: "", courseType: "FREE", price: "", category: "", thumbnail: "", level: "BEGINNER" });
    setShowForm(true);
  };

  const openEditForm = (course) => {
    setEditingCourse(course);
    setForm({
      code: course.code || "",
      name: course.name || "",
      description: course.description || "",
      courseType: course.courseType || "FREE",
      price: course.price ?? "",
      category: course.category || "",
      thumbnail: course.thumbnail || "",
      level: course.level || "BEGINNER",
    });
    setShowForm(true);
  };

  const handleSaveCourse = async (event) => {
    event.preventDefault();
    try {
      setBusyCourseId("form");
      const payload = { ...form, price: form.courseType === "PREMIUM" ? Number(form.price || 0) : 0 };
      if (editingCourse) await updateCourse(editingCourse.id, payload);
      else await createCourse(payload);
      setShowForm(false);
      await loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lưu khóa học.");
    } finally {
      setBusyCourseId("");
    }
  };

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Xóa khóa học ${course.name}?`)) return;
    try {
      setBusyCourseId(course.id);
      await deleteCourse(course.id);
      await loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể xóa khóa học.");
    } finally {
      setBusyCourseId("");
    }
  };

  return (
    <div className="mentor-page-shell">
      <PageHeader
        eyebrow="MENTOR / KHÓA HỌC"
        title="Khóa học của tôi"
        subtitle="Quản lý danh sách khóa học, cập nhật trạng thái xuất bản và theo dõi số lượt ghi danh."
        onReload={loadCourses}
        reloading={loading}
        actions={
          <button className="mentor-button is-primary" type="button" onClick={openCreateForm}>
            <PlusCircle size={16} />
            Tạo khóa học
          </button>
        }
      />

      <div className="mentor-stats-grid">
        <StatCard icon={BookOpen} label="Tổng khóa học" value={stats.total} note="Khóa học do bạn quản lý" />
        <StatCard icon={CheckCircle2} label="Đã công bố" value={stats.published} note="Khóa học đang mở cho học viên" tone="green" />
        <StatCard icon={Clock3} label="Khóa trả phí" value={stats.premium} note="Số khóa đang thu phí" tone="amber" />
        <StatCard icon={Users} label="Tổng lượt ghi danh" value={stats.totalEnrollments} note="Từ toàn bộ khóa học của bạn" tone="blue" />
      </div>

      {loading ? (
        <LoadingState label="Đang tải danh sách khóa học..." />
      ) : error ? (
        <div className="mentor-error" role="alert">{error}</div>
      ) : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="Bạn chưa có khóa học nào." description="Tạo khóa học mới để bắt đầu giảng dạy." />
      ) : (
        <section className="mentor-panel">
          <div className="mentor-panel-header">
            <div className="mentor-panel-title-row">
              <BookOpen size={18} strokeWidth={2} aria-hidden="true" />
              <h2 className="mentor-panel-title">Danh sách khóa học</h2>
            </div>
            <span className="mentor-panel-count">{courses.length} khóa</span>
          </div>

          <div className="mentor-table-wrap">
            <table className="mentor-table">
              <thead>
                <tr>
                  <th>Tên khóa học</th>
                  <th>Loại</th>
                  <th>Bài học</th>
                  <th>Học viên</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id || course._id}>
                    <td className="mentor-course-name">{course.name}</td>
                    <td>
                      <Badge tone={course.courseType === "FREE" ? "free" : "premium"}>
                        {formatCourseType(course.courseType)}
                      </Badge>
                    </td>
                    <td>{course.totalLessons ?? 0}</td>
                    <td>{course.enrollmentCount ?? 0}</td>
                    <td>
                      <Badge tone={course.published ? "live" : "draft"}>
                        {course.published ? "Đã đăng" : "Nháp"}
                      </Badge>
                    </td>
                    <td>
                      <div className="mentor-table-actions">
                          <button
                          type="button"
                          className="mentor-button is-ghost"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          Xem
                        </button>
                        <button
                          type="button"
                          className="mentor-button is-ghost"
                          onClick={() => openEditForm(course)}
                        >
                          <Edit3 size={14} />
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="mentor-button is-secondary"
                          onClick={() => handleTogglePublish(course)}
                          disabled={busyCourseId === course.id}
                        >
                          {course.published ? "Hủy đăng" : "Đăng"}
                        </button>
                        <button
                          type="button"
                          className="mentor-button is-danger"
                          onClick={() => handleDeleteCourse(course)}
                          disabled={busyCourseId === course.id}
                        >
                          <Trash2 size={14} />
                          Xóa
                        </button>
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
          <form className="mentor-modal" onSubmit={handleSaveCourse}>
            <div className="mentor-modal-header">
              <h2>{editingCourse ? "Sửa khóa học" : "Tạo khóa học"}</h2>
              <button type="button" className="mentor-icon-button" onClick={() => setShowForm(false)} aria-label="Đóng">
                <X size={18} />
              </button>
            </div>
            <div className="mentor-form-grid">
              <label>Mã khóa học<input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></label>
              <label>Tên khóa học<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label>Loại khóa học<select value={form.courseType} onChange={(e) => setForm({ ...form, courseType: e.target.value })}><option value="FREE">Miễn phí</option><option value="PREMIUM">Có phí</option></select></label>
              <label>Giá<input type="number" min="0" disabled={form.courseType !== "PREMIUM"} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
              <label>Danh mục<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
              <label>Cấp độ<input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} /></label>
              <label className="mentor-form-full">Ảnh đại diện<input value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} /></label>
              <label className="mentor-form-full">Mô tả<textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            </div>
            <div className="mentor-modal-actions">
              <button type="button" className="mentor-button is-secondary" onClick={() => setShowForm(false)}>Hủy</button>
              <button type="submit" className="mentor-button is-primary" disabled={busyCourseId === "form"}>{busyCourseId === "form" ? "Đang lưu..." : "Lưu khóa học"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default MentorCourses;