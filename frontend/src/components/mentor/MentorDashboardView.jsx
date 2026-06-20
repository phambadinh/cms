import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Clock,
  BarChart3,
  BookMarked,
} from "lucide-react";
import "../../styles/mentorDashboard.css";


const ICON_MAP = {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Clock,
  BarChart3,
  BookMarked,
};

function StatCard({ stat }) {
  const Icon = ICON_MAP[stat.icon] || BarChart3;

  return (
    <div className="mentor-stat-card">
      <div className="mentor-stat-icon-wrap">
        <Icon size={22} strokeWidth={2} className="mentor-stat-icon" aria-hidden="true" />
      </div>
      <div className="mentor-stat-body">
        <p className="mentor-stat-label">{stat.label}</p>
        <p className="mentor-stat-value">{stat.value ?? "—"}</p>
        {stat.note && <p className="mentor-stat-note">{stat.note}</p>}
      </div>
    </div>
  );
}

function MentorDashboardView({
  title,
  subtitle,
  stats = [],
  courses = [],
  enrollments = [],
  loading,
  error,
}) {
  return (
    <div className="mentor-dashboard-shell">
      <div className="mentor-hero">
        <div>
          <span className="mentor-eyebrow">MENTOR</span>
          <h1 className="mentor-title">{title}</h1>
          <p className="mentor-subtitle">{subtitle}</p>
        </div>
      </div>

      {loading && (
        <div className="mentor-loading">
          <span className="mentor-spinner" aria-label="Đang tải..." />
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {error && !loading && (
        <div className="mentor-error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {stats.length > 0 && (
            <div className="mentor-stats-grid">
              {stats.map((stat, i) => (
                <StatCard key={i} stat={stat} />
              ))}
            </div>
          )}

          {courses.length > 0 && (
            <section className="mentor-panel">
              <div className="mentor-panel-header">
                <div className="mentor-panel-title-row">
                  <BookOpen size={18} strokeWidth={2} aria-hidden="true" />
                  <h2 className="mentor-panel-title">Khóa học của tôi</h2>
                </div>
                <span className="mentor-panel-count">{courses.length} khóa</span>
              </div>

              <div className="mentor-table-wrap">
                <table className="mentor-table">
                  <thead>
                    <tr>
                      <th>Tên khóa học</th>
                      <th>Loại</th>
                      <th>Trạng thái</th>
                      <th>Học viên</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c) => (
                      <tr key={c.id || c._id}>
                        <td className="mentor-course-name">{c.name}</td>
                        <td>
                          <span
                            className={`mentor-badge ${
                              c.courseType === "FREE" ? "badge-free" : "badge-premium"
                            }`}
                          >
                            {c.courseType === "FREE" ? "Miễn phí" : "Trả phí"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`mentor-badge ${
                              c.status === "PUBLISHED" ? "badge-live" : "badge-draft"
                            }`}
                          >
                            {c.status === "PUBLISHED" ? "Đã đăng" : "Nháp"}
                          </span>
                        </td>
                        <td>{c.enrollmentCount ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {enrollments.length > 0 && (
            <section className="mentor-panel">
              <div className="mentor-panel-header">
                <div className="mentor-panel-title-row">
                  <Users size={18} strokeWidth={2} aria-hidden="true" />
                  <h2 className="mentor-panel-title">Học viên gần đây</h2>
                </div>
                <span className="mentor-panel-count">{enrollments.length} học viên</span>
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
                    {enrollments.map((e) => (
                      <tr key={e.id || e._id}>
                        <td>{e.studentName || e.username || "—"}</td>
                        <td>{e.courseName || "—"}</td>
                        <td>
                          <div className="mentor-progress-wrap">
                            <div className="mentor-progress-bar">
                              <div
                                className="mentor-progress-fill"
                                style={{ width: `${e.progressPercentage || 0}%` }}
                              />
                            </div>
                            <span className="mentor-progress-label">
                              {e.progressPercentage || 0}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`mentor-badge ${
                              e.status === "COMPLETED" ? "badge-live" : "badge-draft"
                            }`}
                          >
                            {e.status === "COMPLETED" ? "Hoàn thành" : "Đang học"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {!courses.length && !enrollments.length && (
            <div className="mentor-empty">
              <BookMarked size={40} strokeWidth={1.5} aria-hidden="true" />
              <p>Chưa có dữ liệu nào.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MentorDashboardView;