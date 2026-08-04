// src/components/mentor/MentorLectures.jsx
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Clock3, Library } from "lucide-react";
import { getLessonsByCourse, getMyCreatedCourses } from "../../services/api";
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

export default MentorLectures;