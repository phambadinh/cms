import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, TrendingUp, Users } from "lucide-react";
import {
  getAllCourses,
  getAllUsers,
  getEnrollmentsByCourse,
} from "../../services/api";
import "../../styles/dashboard.css";

function AdminProgressPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");

      const [coursesRes, usersRes] = await Promise.all([getAllCourses(), getAllUsers()]);
      const courses = coursesRes.data || [];
      const users = usersRes.data || [];

      const userMap = Object.fromEntries(
        users.map((user) => [user.id, user.name || user.username || user.email || "Unknown user"])
      );

      const results = await Promise.all(
        courses.map(async (course) => {
          try {
            const response = await getEnrollmentsByCourse(course.id);
            return (response.data || []).map((enrollment) => ({
              ...enrollment,
              studentName: userMap[enrollment.userId] || enrollment.userId || "Unknown user",
              courseName: course.name || course.code || "Unknown course",
            }));
          } catch (err) {
            console.error(`Không tải được tiến độ của khóa ${course.id}:`, err);
            return [];
          }
        })
      );

      setItems(results.flat().sort((a, b) => Number(b.progressPercentage || 0) - Number(a.progressPercentage || 0)));
    } catch (err) {
      console.error("Không tải được tiến độ học viên:", err);
      setError("Không thể tải dữ liệu tiến độ học viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const stats = useMemo(() => {
    const completed = items.filter((item) => item.status === "COMPLETED").length;
    const active = items.filter((item) => item.status !== "COMPLETED").length;
    const avgProgress = items.length
      ? items.reduce((sum, item) => sum + Number(item.progressPercentage || 0), 0) / items.length
      : 0;

    return { total: items.length, completed, active, avgProgress };
  }, [items]);

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-module-title">Tiến độ học tập</h1>
          <p className="admin-module-subtitle">Theo dõi tiến độ học tập của học viên.</p>
        </div>

        <div className="admin-module-actions">
          <button type="button" className="admin-module-button" onClick={loadItems}>
            <RefreshCw size={18} style={{ marginRight: 6 }} />
            Làm mới
          </button>
        </div>
      </div>

      {error && <div className="dash-error">{error}</div>}

      <div className="mentor-stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon"><Users size={18} /></div>
          <div>
            <div className="stat-label">Tổng bản ghi</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CheckCircle2 size={18} /></div>
          <div>
            <div className="stat-label">Hoàn thành</div>
            <div className="stat-value">{stats.completed}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><TrendingUp size={18} /></div>
          <div>
            <div className="stat-label">Trung bình</div>
            <div className="stat-value">{Math.round(stats.avgProgress)}%</div>
          </div>
        </div>
      </div>

      <div className="admin-module-card">
        <div className="admin-module-toolbar">
          <span>Theo dõi tiến độ</span>
          <span>{items.length} bản ghi</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Học viên</th>
                <th>Khóa học</th>
                <th>Tiến độ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "24px" }}>Đang tải...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "24px" }}>Không có dữ liệu tiến độ.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id || `${item.userId}-${item.courseId}`}>
                    <td>{item.studentName}</td>
                    <td>{item.courseName}</td>
                    <td>
                      <div className="mentor-progress-wrap">
                        <div className="mentor-progress-bar">
                          <div
                            className="mentor-progress-fill"
                            style={{ width: `${Math.min(Number(item.progressPercentage || 0), 100)}%` }}
                          />
                        </div>
                        <span className="mentor-progress-label">{Math.round(Number(item.progressPercentage || 0))}%</span>
                      </div>
                    </td>
                    <td>{item.status || "UNKNOWN"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminProgressPage;
