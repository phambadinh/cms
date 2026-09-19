import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, RefreshCw, Users } from "lucide-react";
import {
  getAllCourses,
  getAllUsers,
  getEnrollmentsByCourse,
} from "../../services/api";
import "../../styles/dashboard.css";

function AdminEnrollmentsPage() {
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
      const userMap = Object.fromEntries(users.map((user) => [user.id, user.name || user.username || user.email || "Unknown user"]));

      const results = await Promise.all(
        courses.map(async (course) => {
          try {
            const response = await getEnrollmentsByCourse(course.id);
            return (response.data || []).map((enrollment) => ({
              ...enrollment,
              courseId: enrollment.courseId || course.id,
              courseName: course.name || course.code || "Không tên",
              studentName: userMap[enrollment.userId] || enrollment.userId || "Unknown user",
            }));
          } catch (err) {
            console.error(`Không tải được enrollment của khóa ${course.id}:`, err);
            return [];
          }
        })
      );

      setItems(results.flat().sort((a, b) => (b.enrolledAt || "").localeCompare(a.enrolledAt || "")));
    } catch (err) {
      console.error("Không tải được danh sách enrollment:", err);
      setError("Không thể tải danh sách đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const stats = useMemo(() => {
    const active = items.filter((item) => item.status === "ACTIVE").length;
    const completed = items.filter((item) => item.status === "COMPLETED").length;
    return { total: items.length, active, completed };
  }, [items]);

  const getStatusLabel = (status) => ({
    ACTIVE: "Đang hoạt động",
    PENDING: "Chờ xử lý",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
    INACTIVE: "Không hoạt động",
  }[status] || "Không xác định");

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-module-title">Đăng ký khóa học</h1>
          <p className="admin-module-subtitle">Theo dõi học viên đăng ký và trạng thái.</p>
        </div>

        <div className="admin-module-actions">
          <button type="button" className="admin-module-button" onClick={loadItems}>
            <RefreshCw size={18} style={{ marginRight: 6 }} />
            Làm mới
          </button>
        </div>
      </div>

      {error && <div className="dash-error">{error}</div>}

      <div className="admin-enrollment-stats">
        <div className="admin-enrollment-stat">
          <div className="admin-enrollment-stat-icon"><Users size={18} /></div>
          <div>
            <div className="admin-enrollment-stat-label">Tổng đăng ký</div>
            <div className="admin-enrollment-stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="admin-enrollment-stat">
          <div className="admin-enrollment-stat-icon"><BookOpen size={18} /></div>
          <div>
            <div className="admin-enrollment-stat-label">Đang hoạt động</div>
            <div className="admin-enrollment-stat-value">{stats.active}</div>
          </div>
        </div>
        <div className="admin-enrollment-stat">
          <div className="admin-enrollment-stat-icon"><CheckCircle2 size={18} /></div>
          <div>
            <div className="admin-enrollment-stat-label">Hoàn thành</div>
            <div className="admin-enrollment-stat-value">{stats.completed}</div>
          </div>
        </div>
      </div>

      <div className="admin-module-card admin-enrollment-panel">
        <div className="admin-module-toolbar admin-enrollment-toolbar">
          <strong>Danh sách đăng ký</strong>
          <span>{items.length} bản ghi</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table admin-enrollment-table">
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
                  <td colSpan={4} style={{ textAlign: "center", padding: "24px" }}>Không có dữ liệu đăng ký.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id || `${item.userId}-${item.courseId}`}>
                    <td>{item.studentName}</td>
                    <td>{item.courseName}</td>
                    <td>
                      <div className="admin-enrollment-progress">
                        <span>{Number(item.progressPercentage || 0).toFixed(0)}%</span>
                        <div className="admin-enrollment-progress-track">
                          <span style={{ width: `${Math.min(100, Math.max(0, Number(item.progressPercentage || 0)))}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-enrollment-status ${item.status === "COMPLETED" ? "is-complete" : item.status === "ACTIVE" ? "is-active" : "is-pending"}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
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

export default AdminEnrollmentsPage;
