import "../../styles/student-dashboard.css";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  PlayCircle,
  Search,
  Filter,
} from "lucide-react";
import { useState } from "react";
import MyCourseCard from "./MyCourseCard";

function StudentDashboardView({
  courses = [],
  enrollments = [],
  loading = false,
  error = "",
  onContinueLearning,
  onViewCertificate,
  onViewCourse,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => c.status === "COMPLETED").length;
  const activeCourses = courses.filter((c) => c.status === "ACTIVE").length;
  const avgProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum, c) => sum + (c.progressPercentage || 0), 0) /
            courses.length
        )
      : 0;

  const stats = [
    { label: "Tổng khóa học", value: totalCourses, icon: BookOpen, color: "student-stat-blue" },
    { label: "Đang học", value: activeCourses, icon: Clock, color: "student-stat-yellow" },
    { label: "Hoàn thành", value: completedCourses, icon: CheckCircle2, color: "student-stat-green" },
    { label: "Tiến độ TB", value: `${avgProgress}%`, icon: TrendingUp, color: "student-stat-purple" },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchSearch = course.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === "ALL" || course.status === filterStatus;
    return matchSearch && matchFilter;
  });

  return (
    <div className="student-dashboard-shell">
      <div className="student-dash-header">
        <div>
          <h1 className="student-dash-title">Khóa học của tôi</h1>
          <p className="student-dash-subtitle">
            Theo dõi tiến độ học tập và tiếp tục học.
          </p>
        </div>
      </div>

      {error && <p className="student-dash-error">{error}</p>}

      {loading ? (
        <div className="student-dash-loading">
          <div className="student-dash-spinner" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="student-stats-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`student-stat-card ${stat.color}`}>
                  <div className="student-stat-icon-wrap">
                    <Icon size={22} />
                  </div>
                  <div className="student-stat-info">
                    <span className="student-stat-value">{stat.value}</span>
                    <span className="student-stat-label">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="student-course-toolbar">
            <div className="student-search-wrap">
              <Search size={16} className="student-search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="student-course-search"
              />
            </div>

            <div className="student-filter-wrap">
              <Filter size={16} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="student-course-filter"
              >
                <option value="ALL">Tất cả</option>
                <option value="ACTIVE">Đang học</option>
                <option value="COMPLETED">Hoàn thành</option>
              </select>
            </div>
          </div>

          <section className="student-course-section">
            {filteredCourses.length === 0 ? (
              <div className="student-empty-state">
                <BookOpen size={48} strokeWidth={1} />
                <h3>
                  {searchQuery || filterStatus !== "ALL"
                    ? "Không tìm thấy khóa học phù hợp"
                    : "Bạn chưa đăng ký khóa học nào"}
                </h3>
                <p>
                  {searchQuery || filterStatus !== "ALL"
                    ? "Thử thay đổi từ khóa hoặc bộ lọc"
                    : "Khám phá các khóa học và bắt đầu hành trình học tập"}
                </p>
                {!searchQuery && filterStatus === "ALL" && (
                  <a href="/courses" className="student-btn-explore">
                    <PlayCircle size={16} />
                    Khám phá khóa học
                  </a>
                )}
              </div>
            ) : (
              <div className="student-course-grid">
                {filteredCourses.map((course) => (
                  <MyCourseCard
                    key={course.id}
                    course={course}
                    onContinueLearning={onContinueLearning}
                    onViewCertificate={onViewCertificate}
                    onViewCourse={onViewCourse}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default StudentDashboardView;