// src/components/mentor/MentorProgress.jsx
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, TrendingUp, Users } from "lucide-react";
import { getEnrollmentsByCourse, getMyCreatedCourses } from "../../services/api";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import Badge from "./Badge";
import { average, formatPercent, studentLabel } from "../../utils/mentorFormatters";
import "../../styles/mentorDashboard.css";

function MentorProgress() {
  const [progressRows, setProgressRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const coursesResponse = await getMyCreatedCourses();
      const courseList = coursesResponse.data || [];

      const progressResults = await Promise.all(
        courseList.map(async (course) => {
          try {
            const response = await getEnrollmentsByCourse(course.id);
            return (response.data || []).map((enrollment) => ({ ...enrollment, courseName: course.name }));
          } catch (err) {
            console.error(`Không tải được tiến độ của khóa ${course.name}:`, err);
            return [];
          }
        })
      );

      setProgressRows(progressResults.flat());
      setError("");
    } catch (err) {
      console.error("Không tải được dữ liệu tiến độ:", err);
      setError("Không thể tải danh sách tiến độ học viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const completed = progressRows.filter((row) => row.status === "COMPLETED").length;
    const active = progressRows.filter((row) => row.status !== "COMPLETED").length;
    const averageProgress = average(progressRows.map((row) => Number(row.progressPercentage || 0)));
    return { totalEnrollments: progressRows.length, completed, active, averageProgress };
  }, [progressRows]);

  return (
    <div className="mentor-page-shell">
      <PageHeader
        eyebrow="MENTOR / TIẾN ĐỘ"
        title="Tiến độ học viên"
        subtitle="Theo dõi tiến độ hoàn thành, số học viên đang học và tình trạng hoàn thành của từng khóa."
        onReload={loadData}
        reloading={loading}
      />

      <div className="mentor-stats-grid">
        <StatCard icon={Users} label="Tổng ghi danh" value={stats.totalEnrollments} note="Tất cả học viên trong các lớp của bạn" />
        <StatCard icon={CheckCircle2} label="Đã hoàn thành" value={stats.completed} note="Số học viên đã kết thúc khóa" tone="green" />
        <StatCard icon={TrendingUp} label="Đang học" value={stats.active} note="Học viên còn hoạt động" tone="amber" />
        <StatCard icon={TrendingUp} label="Tiến độ trung bình" value={formatPercent(stats.averageProgress)} note="Trung bình toàn bộ các enrollment" tone="blue" />
      </div>

      {loading ? (
        <LoadingState label="Đang tải tiến độ học viên..." />
      ) : error ? (
        <div className="mentor-error" role="alert">{error}</div>
      ) : progressRows.length === 0 ? (
        <EmptyState icon={TrendingUp} title="Chưa có tiến độ học viên nào." />
      ) : (
        <section className="mentor-panel">
          <div className="mentor-panel-header">
            <div className="mentor-panel-title-row">
              <TrendingUp size={18} strokeWidth={2} aria-hidden="true" />
              <h2 className="mentor-panel-title">Danh sách tiến độ</h2>
            </div>
            <span className="mentor-panel-count">{progressRows.length} học viên</span>
          </div>

          <div className="mentor-table-wrap">
            <table className="mentor-table">
              <thead>
                <tr>
                  <th>Học viên</th>
                  <th>Khóa học</th>
                  <th>Tiến độ</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {progressRows.map((row) => (
                  <tr key={row.id || `${row.userId}-${row.courseId}`}>
                    <td className="mentor-course-name">{studentLabel(row)}</td>
                    <td>{row.courseName}</td>
                    <td>
                      <div className="mentor-progress-wrap">
                        <div className="mentor-progress-bar">
                          <div
                            className="mentor-progress-fill"
                            style={{ width: `${Math.min(Number(row.progressPercentage || 0), 100)}%` }}
                          />
                        </div>
                        <span className="mentor-progress-label">{formatPercent(row.progressPercentage)}</span>
                      </div>
                    </td>
                    <td>
                      <Badge tone={row.status === "COMPLETED" ? "completed" : "active"}>
                        {row.status === "COMPLETED" ? "Hoàn thành" : "Đang học"}
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

export default MentorProgress;