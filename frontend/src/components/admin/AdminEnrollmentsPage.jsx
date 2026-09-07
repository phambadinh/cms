import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, RefreshCw, UserX, Users } from "lucide-react";
import {
  completeEnrollment,
  getAllCourses,
  getAllUsers,
  getEnrollmentsByCourse,
  unenrollFromCourse,
} from "../../services/api";
import "../../styles/dashboard.css";

function AdminEnrollmentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

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

  const handleComplete = async (enrollmentId) => {
    try {
      setBusyId(enrollmentId);
      await completeEnrollment(enrollmentId);
      await loadItems();
    } catch (err) {
      console.error("Không hoàn thành enrollment:", err);
      setError("Không thể cập nhật trạng thái hoàn thành.");
    } finally {
      setBusyId("");
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    try {
      setBusyId(enrollmentId);
      await unenrollFromCourse(enrollmentId);
      await loadItems();
    } catch (err) {
      console.error("Không hủy đăng ký enrollment:", err);
      setError("Không thể hủy đăng ký.");
    } finally {
      setBusyId("");
    }
  };

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

      <div className="mentor-stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon"><Users size={18} /></div>
          <div>
            <div className="stat-label">Tổng đăng ký</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><BookOpen size={18} /></div>
          <div>
            <div className="stat-label">Đang hoạt động</div>
            <div className="stat-value">{stats.active}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CheckCircle2 size={18} /></div>
          <div>
            <div className="stat-label">Hoàn thành</div>
            <div className="stat-value">{stats.completed}</div>
          </div>
        </div>
      </div>

      <div className="admin-module-card">
        <div className="admin-module-toolbar">
          <span>Danh sách đăng ký</span>
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
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "24px" }}>Đang tải...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "24px" }}>Không có dữ liệu đăng ký.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id || `${item.userId}-${item.courseId}`}>
                    <td>{item.studentName}</td>
                    <td>{item.courseName}</td>
                    <td>{Number(item.progressPercentage || 0).toFixed(0)}%</td>
                    <td>{item.status || "UNKNOWN"}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-row-button"
                          onClick={() => handleComplete(item.id)}
                          disabled={!item.id || busyId === item.id}
                        >
                          <CheckCircle2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="admin-row-button danger"
                          onClick={() => handleUnenroll(item.id)}
                          disabled={!item.id || busyId === item.id}
                        >
                          <UserX size={14} />
                        </button>
                      </div>
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
