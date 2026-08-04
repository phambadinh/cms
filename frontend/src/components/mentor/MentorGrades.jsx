// src/components/mentor/MentorGrades.jsx
// NOTE: cần hàm getGradesByCourse(courseId) trong services/api.js
import { useEffect, useMemo, useState } from "react";
import { Award, BookOpen, CheckCircle2, Users } from "lucide-react";
import { getGradesByCourse, getMyCreatedCourses } from "../../services/api";
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

export default MentorGrades;