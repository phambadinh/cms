// src/components/mentor/MentorCourses.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle2, Clock3, PlusCircle, Users } from "lucide-react";
import { getMyCreatedCourses, publishCourse, unpublishCourse } from "../../services/api";
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

  return (
    <div className="mentor-page-shell">
      <PageHeader
        eyebrow="MENTOR / KHÓA HỌC"
        title="Khóa học của tôi"
        subtitle="Quản lý danh sách khóa học, cập nhật trạng thái xuất bản và theo dõi số lượt ghi danh."
        onReload={loadCourses}
        reloading={loading}
        actions={
          <button className="mentor-button is-primary" type="button" onClick={() => navigate("/courses")}>
            <PlusCircle size={16} />
            Xem khóa học
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
                          className="mentor-button is-secondary"
                          onClick={() => handleTogglePublish(course)}
                          disabled={busyCourseId === course.id}
                        >
                          {course.published ? "Hủy đăng" : "Đăng"}
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
    </div>
  );
}

export default MentorCourses;