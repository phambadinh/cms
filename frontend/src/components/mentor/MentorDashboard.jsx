// src/components/mentor/MentorDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { getMyCreatedCourses, getEnrollmentsByCourse } from "../../services/api";
import { MENTOR_QUICK_ACTIONS } from "../../config/mentorNav";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import Badge from "./Badge";
import { average, formatCourseType, formatPercent, studentLabel } from "../../utils/mentorFormatters";
import "../../styles/mentorDashboard.css";

function MentorDashboard() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
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
            const res = await getEnrollmentsByCourse(course.id);
            return (res.data || []).map((e) => ({
              ...e,
              courseName: course.name,
              courseId: course.id,
            }));
          } catch (err) {
            console.error(`Không tải được học viên của khóa ${course.name}:`, err);
            return [];
          }
        })
      );

      setEnrollments(results.flat());
      setError("");
    } catch (err) {
      console.error("Không tải được dashboard mentor:", err);
      setError("Không thể tải dữ liệu tổng quan. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const publishedCourses = courses.filter((c) => c.published).length;
    const uniqueStudents = new Set(enrollments.map((e) => e.userId)).size;
    const activeStudents = enrollments.filter((e) => e.status !== "COMPLETED").length;
    const completed = enrollments.filter((e) => e.status === "COMPLETED").length;
    const avgProgress = average(enrollments.map((e) => Number(e.progressPercentage || 0)));

    return {
      totalCourses: courses.length,
      publishedCourses,
      uniqueStudents,
      activeStudents,
      completed,
      avgProgress,
    };
  }, [courses, enrollments]);

  const atRiskStudents = useMemo(
    () =>
      enrollments
        .filter((e) => e.status !== "COMPLETED" && Number(e.progressPercentage || 0) < 30)
        .sort((a, b) => Number(a.progressPercentage || 0) - Number(b.progressPercentage || 0))
        .slice(0, 5),
    [enrollments]
  );

  const recentActivity = useMemo(
    () =>
      [...enrollments]
        .sort((a, b) => new Date(b.updatedAt || b.enrolledAt || 0) - new Date(a.updatedAt || a.enrolledAt || 0))
        .slice(0, 6),
    [enrollments]
  );

  const topCourses = useMemo(() => {
    const byId = new Map();
    enrollments.forEach((e) => {
      const key = e.courseId;
      byId.set(key, (byId.get(key) || 0) + 1);
    });
    return courses
      .map((c) => ({ ...c, liveEnrollments: byId.get(c.id) || 0 }))
      .sort((a, b) => b.liveEnrollments - a.liveEnrollments)
      .slice(0, 5);
  }, [courses, enrollments]);

  return (
    <div className="mentor-page-shell">
      <PageHeader
        eyebrow="MENTOR"
        title="Tổng quan giảng dạy"
        subtitle="Theo dõi học viên đang học gì, tiến độ ra sao, và những khóa cần bạn quan tâm ngay."
        onReload={loadData}
        reloading={loading}
      />

      <div className="mentor-actions-grid">
        {MENTOR_QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.to} to={action.to} className="mentor-action-card">
              <div className="mentor-action-icon-wrap">
                <Icon size={18} strokeWidth={2} aria-hidden="true" />
              </div>
              <div>
                <h2 className="mentor-action-title">{action.label}</h2>
                <p className="mentor-action-desc">{action.description}</p>
              </div>
              <ArrowUpRight size={16} className="mentor-action-arrow" aria-hidden="true" />
            </Link>
          );
        })}
      </div>

      {loading ? (
        <LoadingState label="Đang tải tổng quan giảng dạy..." />
      ) : error ? (
        <div className="mentor-error" role="alert">{error}</div>
      ) : (
        <>
          <div className="mentor-stats-grid">
            <StatCard icon={BookOpen} label="Khóa học" value={stats.totalCourses} note={`${stats.publishedCourses} đã xuất bản`} />
            <StatCard icon={Users} label="Học viên" value={stats.uniqueStudents} note="Học viên duy nhất trong các lớp của bạn" tone="blue" />
            <StatCard icon={TrendingUp} label="Đang học" value={stats.activeStudents} note="Lượt ghi danh còn hoạt động" tone="amber" />
            <StatCard icon={CheckCircle2} label="Tiến độ trung bình" value={formatPercent(stats.avgProgress)} note={`${stats.completed} lượt đã hoàn thành`} tone="green" />
          </div>

          <div className="mentor-two-col">
            <section className="mentor-panel">
              <div className="mentor-panel-header">
                <div className="mentor-panel-title-row">
                  <TrendingUp size={18} strokeWidth={2} aria-hidden="true" />
                  <h2 className="mentor-panel-title">Học viên đang học gần đây</h2>
                </div>
                <Link to="/mentor/progress" className="mentor-panel-link">Xem tất cả</Link>
              </div>

              {recentActivity.length === 0 ? (
                <EmptyState icon={Users} title="Chưa có học viên nào ghi danh." />
              ) : (
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
                      {recentActivity.map((e) => (
                        <tr key={e.id || `${e.userId}-${e.courseId}`}>
                          <td className="mentor-course-name">{studentLabel(e)}</td>
                          <td>{e.courseName}</td>
                          <td>
                            <div className="mentor-progress-wrap">
                              <div className="mentor-progress-bar">
                                <div
                                  className="mentor-progress-fill"
                                  style={{ width: `${Math.min(Number(e.progressPercentage || 0), 100)}%` }}
                                />
                              </div>
                              <span className="mentor-progress-label">{formatPercent(e.progressPercentage)}</span>
                            </div>
                          </td>
                          <td>
                            <Badge tone={e.status === "COMPLETED" ? "completed" : "active"}>
                              {e.status === "COMPLETED" ? "Hoàn thành" : "Đang học"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="mentor-panel">
              <div className="mentor-panel-header">
                <div className="mentor-panel-title-row">
                  <AlertTriangle size={18} strokeWidth={2} aria-hidden="true" />
                  <h2 className="mentor-panel-title">Học viên cần hỗ trợ</h2>
                </div>
                <span className="mentor-panel-count">Tiến độ dưới 30%</span>
              </div>

              {atRiskStudents.length === 0 ? (
                <EmptyState icon={CheckCircle2} title="Không có học viên nào bị tụt tiến độ." />
              ) : (
                <ul className="mentor-risk-list">
                  {atRiskStudents.map((e) => (
                    <li key={e.id || `${e.userId}-${e.courseId}`} className="mentor-risk-item">
                      <div>
                        <p className="mentor-risk-name">{studentLabel(e)}</p>
                        <p className="mentor-risk-course">{e.courseName}</p>
                      </div>
                      <Badge tone="danger">{formatPercent(e.progressPercentage)}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="mentor-panel">
            <div className="mentor-panel-header">
              <div className="mentor-panel-title-row">
                <BookOpen size={18} strokeWidth={2} aria-hidden="true" />
                <h2 className="mentor-panel-title">Khóa học nổi bật</h2>
              </div>
              <Link to="/mentor/courses" className="mentor-panel-link">Quản lý khóa học</Link>
            </div>

            {topCourses.length === 0 ? (
              <EmptyState icon={BookOpen} title="Bạn chưa có khóa học nào." />
            ) : (
              <div className="mentor-table-wrap">
                <table className="mentor-table">
                  <thead>
                    <tr>
                      <th>Tên khóa học</th>
                      <th>Loại</th>
                      <th>Trạng thái</th>
                      <th>Học viên đang học</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCourses.map((c) => (
                      <tr key={c.id}>
                        <td className="mentor-course-name">{c.name}</td>
                        <td>
                          <Badge tone={c.courseType === "FREE" ? "free" : "premium"}>
                            {formatCourseType(c.courseType)}
                          </Badge>
                        </td>
                        <td>
                          <Badge tone={c.published ? "live" : "draft"}>
                            {c.published ? "Đã đăng" : "Nháp"}
                          </Badge>
                        </td>
                        <td>{c.liveEnrollments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default MentorDashboard;