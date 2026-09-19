import { useNavigate } from "react-router-dom";
import { getAuthUser } from "../../services/api";
import {
  Gauge,
  Users,
  UserCog,
  UserPlus,
  BookOpen,
  LineChart,
  RefreshCw,
  FileText,
  GraduationCap,
} from "lucide-react";
import "../../styles/dashboard.css";

const quickActions = [
  { label: "Tạo khóa học", to: "/admin/courses", icon: BookOpen },
  { label: "Thêm người dùng", to: "/admin/users", icon: UserPlus },
  { label: "Thêm giảng viên", to: "/admin/teachers", icon: GraduationCap },
  { label: "Tạo bài học", to: "/admin/lectures", icon: FileText },
  { label: "Xem ghi danh", to: "/admin/enrollments", icon: Users },
  { label: "Phân tích tiến độ", to: "/admin/progress", icon: LineChart },
];

function AdminDashboardView({
  title,
  subtitle,
  stats = [],
  charts = [],
  courses = [],
  mentors = [],
  enrollments = [],
  loading = false,
  error = "",
}) {
  const navigate = useNavigate();
  const user = getAuthUser();

  const roleStats = stats.slice(0, 4);
  const insightStats = stats.slice(4);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="layout-main admin-dashboard-shell">
      {/* HERO */}
      <section className="admin-hero">
        <div>
          <div className="admin-eyebrow">
            <Gauge size={16} style={{ marginRight: 6 }} />
            Admin Control Center
          </div>
          <h1 className="admin-title">{title}</h1>
          <p className="admin-subtitle">{subtitle}</p>
        </div>
        <div className="admin-hero-meta">
          <div className="admin-admin-chip">
            <UserCog size={16} style={{ marginRight: 6 }} />
            {user?.fullName || user?.username || "Admin"}
          </div>
          <button className="admin-refresh" onClick={handleRefresh}>
            <RefreshCw size={16} style={{ marginRight: 6 }} />
            Refresh
          </button>
        </div>
      </section>

      {error && <p className="dash-error">{error}</p>}

      {loading ? (
        <div className="dashboard-loading">Đang tải dữ liệu tổng quan...</div>
      ) : (
        <>
          {/* TOP METRICS */}
          <section className="admin-metrics-grid">
            {roleStats.map((stat) => (
              <div className="admin-metric-card" key={stat.label}>
                <div className="admin-metric-label">{stat.label}</div>
                <div className="admin-metric-value">{stat.value}</div>
                {stat.description && (
                  <div className="admin-metric-note">{stat.description}</div>
                )}
              </div>
            ))}
          </section>

          {/* QUICK ACTIONS */}
          <section className="admin-actions-panel">
            <div className="admin-panel-header">
              <h2>Thao tác nhanh</h2>
              <span>Điều hướng nhanh đến các khu vực quản trị</span>
            </div>
            <div className="admin-actions-grid">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className="admin-action-card"
                    onClick={() => navigate(action.to)}
                  >
                    <Icon size={18} style={{ marginRight: 8 }} />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* INSIGHTS (CHARTS) */}
          <section className="admin-insights-grid">
            {(charts || []).map((chart) => (
              <InsightCard key={chart.title} chart={chart} />
            ))}
          </section>

          {/* SECONDARY METRICS */}
          <section className="admin-metrics-grid admin-metrics-secondary">
            {insightStats.map((stat) => (
              <div
                className="admin-metric-card admin-metric-card-compact"
                key={stat.label}
              >
                <div className="admin-metric-label">{stat.label}</div>
                <div className="admin-metric-value">{stat.value}</div>
                {stat.description && (
                  <div className="admin-metric-note">{stat.description}</div>
                )}
              </div>
            ))}
          </section>

          {/* TABLES: COURSES / ENROLLMENTS / MENTORS */}
          <section className="admin-content-grid">
            {/* Top courses */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h2>Khóa học nổi bật</h2>
                <span>Dựa trên lượt xem và đăng ký</span>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Khóa học</th>
                      <th>Loại</th>
                      <th>Đăng ký</th>
                      <th>Lượt xem</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.name}</td>
                        <td>{course.courseType || "N/A"}</td>
                        <td>{course.enrollmentCount ?? 0}</td>
                        <td>{course.viewCount ?? 0}</td>
                        <td>
                          <span
                            className={
                              course.published
                                ? "status-badge status-live"
                                : "status-badge status-draft"
                            }
                          >
                            {course.published ? "Đã đăng" : "Nháp"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent enrollments */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h2>Ghi danh gần đây</h2>
                <span>Trạng thái học viên theo khóa</span>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Học viên</th>
                      <th>Khóa học</th>
                      <th>Tiến độ</th>
                      <th>Thanh toán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td>{enrollment.userName || enrollment.userId}</td>
                        <td>{enrollment.courseName || enrollment.courseId}</td>
                        <td>{enrollment.progressPercentage ?? 0}%</td>
                        <td>{enrollment.paymentStatus || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top mentors */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h2>Top giảng viên</h2>
                <span>Xếp hạng theo lượt xem + ghi danh</span>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Giảng viên</th>
                      <th>Khóa</th>
                      <th>Ghi danh</th>
                      <th>Lượt xem</th>
                      <th>Đã công bố</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentors.map((mentor) => (
                      <tr key={mentor.id}>
                        <td>{mentor.name}</td>
                        <td>{mentor.courseCount ?? 0}</td>
                        <td>{mentor.enrollmentCount ?? 0}</td>
                        <td>{mentor.viewCount ?? 0}</td>
                        <td>{mentor.publishedCourseCount ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </section>
        </>
      )}
    </div>
  );
}

function InsightCard({ chart }) {
  const items = chart.items || [];
  const total = items.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  return (
    <div className="admin-panel admin-chart-card">
      <div className="admin-panel-header">
        <h2>{chart.title}</h2>
        <span>{chart.subtitle}</span>
      </div>

      {chart.type === "DONUT" ? (
        <DonutChart chart={chart} total={total} />
      ) : (
        <BarChart chart={chart} total={total} />
      )}
    </div>
  );
}

function BarChart({ chart }) {
  const items = chart.items || [];
  const maxValue = Math.max(
    ...items.map((item) => item.value || 0),
    1
  );

  return (
    <div className="chart-bars">
      {items.map((item) => {
        const width = Math.max(
          ((item.value || 0) / maxValue) * 100,
          8
        );
        return (
          <div className="chart-bar-row" key={item.label}>
            <div className="chart-bar-meta">
              <span className="chart-label">{item.label}</span>
              <span className="chart-value">
                {Number(item.value || 0).toLocaleString()}
              </span>
            </div>
            <div className="chart-bar-track">
              <div
                className="chart-bar-fill"
                style={{
                  width: `${width}%`,
                  background: item.color || "#2563eb",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ chart, total }) {
  const items = chart.items || [];
  const size = 190;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="donut-wrap">
      <div className="donut-visual">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5eef9"
            strokeWidth={strokeWidth}
          />
          {items.map((item) => {
            const portion =
              total > 0 ? (item.value || 0) / total : 0;
            const dash = Math.max(
              portion * circumference,
              0.01
            );
            const segment = (
              <circle
                key={item.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color || "#2563eb"}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${
                  circumference - dash
                }`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${
                  size / 2
                } ${size / 2})`}
              />
            );
            offset += dash;
            return segment;
          })}
        </svg>
        <div className="donut-center">
          <div className="donut-total">
            {Number(total).toLocaleString()}
          </div>
          <div className="donut-caption">Tổng</div>
        </div>
      </div>

      <div className="donut-legend">
        {items.map((item) => (
          <div
            className="donut-legend-row"
            key={item.label}
          >
            <span
              className="donut-dot"
              style={{
                background: item.color || "#2563eb",
              }}
            />
            <span className="donut-name">{item.label}</span>
            <span className="donut-percentage">
              {item.percentage?.toFixed(1) || 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboardView;