import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, TrendingUp, Users } from "lucide-react";
import { getEnrollmentsByCourse, getMyCreatedCourses } from "../../services/api";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import Badge from "./Badge";
import "../../styles/mentorDashboard.css";

function MentorProgress() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const coursesResponse = await getMyCreatedCourses();
      const courses = coursesResponse.data || [];
      const results = await Promise.all(
        courses.map(async (course) => {
          try {
            const response = await getEnrollmentsByCourse(course.id);
            return (response.data || []).map((item) => ({
              ...item,
              courseId: item.courseId || course.id,
              courseName: course.name || course.code || "Không tên",
            }));
          } catch (requestError) {
            console.error(`Không tải được tiến độ khóa ${course.name}:`, requestError);
            return [];
          }
        })
      );
      setItems(results.flat());
      setError("");
    } catch (requestError) {
      console.error("Không tải được tiến độ học viên:", requestError);
      setError(requestError.response?.data?.message || "Không thể tải tiến độ học viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const completed = items.filter((item) => item.status === "COMPLETED").length;
    const average = items.length
      ? items.reduce((total, item) => total + Number(item.progressPercentage || 0), 0) / items.length
      : 0;
    return { total: items.length, completed, average };
  }, [items]);

  const progressValue = (item) => Math.min(100, Math.max(0, Number(item.progressPercentage || 0)));

  return (
    <div className="mentor-page-shell">
      <PageHeader
        eyebrow="MENTOR / TIẾN ĐỘ"
        title="Tiến độ học tập"
        subtitle="Theo dõi tiến độ hoàn thành của học viên theo từng khóa học."
        onReload={loadData}
        reloading={loading}
      />

      <div className="mentor-stats-grid">
        <StatCard icon={Users} label="Tổng bản ghi" value={stats.total} note="Số lượt học viên đang theo dõi" />
        <StatCard icon={CheckCircle2} label="Hoàn thành" value={stats.completed} note="Học viên đã hoàn thành" tone="green" />
        <StatCard icon={TrendingUp} label="Tiến độ trung bình" value={`${Math.round(stats.average)}%`} note="Trung bình toàn bộ học viên" tone="blue" />
      </div>

      {loading ? (
        <LoadingState label="Đang tải tiến độ học tập..." />
      ) : error ? (
        <div className="mentor-error" role="alert">{error}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={TrendingUp} title="Chưa có dữ liệu tiến độ" description="Tiến độ học viên sẽ xuất hiện sau khi có lượt đăng ký khóa học." />
      ) : (
        <section className="mentor-panel">
          <div className="mentor-panel-header">
            <div className="mentor-panel-title-row">
              <TrendingUp size={18} strokeWidth={2} aria-hidden="true" />
              <h2 className="mentor-panel-title">Danh sách tiến độ</h2>
            </div>
            <span className="mentor-panel-count">{items.length} bản ghi</span>
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
                {items.map((item) => {
                  const value = progressValue(item);
                  const status = item.status || "PENDING";
                  return (
                    <tr key={item.id || `${item.userId}-${item.courseId}`}>
                      <td className="mentor-course-name">{item.studentName || item.username || item.userId || "Không rõ"}</td>
                      <td>{item.courseName}</td>
                      <td>
                        <div className="mentor-progress-wrap">
                          <div className="mentor-progress-bar"><div className="mentor-progress-fill" style={{ width: `${value}%` }} /></div>
                          <span className="mentor-progress-label">{Math.round(value)}%</span>
                        </div>
                      </td>
                      <td>
                        <Badge tone={status === "COMPLETED" ? "completed" : status === "ACTIVE" ? "live" : "draft"}>
                          {status === "COMPLETED" ? "Hoàn thành" : status === "ACTIVE" ? "Đang hoạt động" : "Chờ xử lý"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default MentorProgress;
