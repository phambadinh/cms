import {
  BookOpen,
  Users,
  GraduationCap,
  Activity,
  PlusCircle,
  FileText,
  BarChart3,
  UserPlus,
} from "lucide-react";

import "../../styles/dashboard.css";

function MentorDashboardView({
  title,
  subtitle,
  stats = [],
  courses = [],
  enrollments = [],
  loading = false,
  error = "",
}) {
  const getStatValue = (index) =>
    stats[index]?.value || 0;

  return (
    <div className="layout-main dashboard-shell">

      {/* HERO */}

      <div className="dashboard-header">

        <h1 className="dash-title">
          Chào mừng trở lại 👋
        </h1>

        <p className="dash-subtitle">
          Quản lý khóa học, học viên và theo dõi
          hiệu suất giảng dạy của bạn.
        </p>

      </div>

      {error && (
        <p className="dash-error">
          {error}
        </p>
      )}

      {loading ? (
        <div className="dashboard-loading">
          Đang tải dữ liệu...
        </div>
      ) : (
        <>

          {/* STATS */}

          <section className="dash-cards">

            <div className="dash-card">

              <div className="dash-card-icon">
                <BookOpen size={28} />
              </div>

              <div className="dash-number">
                {getStatValue(0)}
              </div>

              <h3>Khóa học của tôi</h3>

              <p className="dash-note">
                Tổng số khóa học đang quản lý
              </p>

            </div>

            <div className="dash-card">

              <div className="dash-card-icon">
                <GraduationCap size={28} />
              </div>

              <div className="dash-number">
                {getStatValue(1)}
              </div>

              <h3>Đã công bố</h3>

              <p className="dash-note">
                Khóa học đang mở cho học viên
              </p>

            </div>

            <div className="dash-card">

              <div className="dash-card-icon">
                <Users size={28} />
              </div>

              <div className="dash-number">
                {getStatValue(2)}
              </div>

              <h3>Học viên</h3>

              <p className="dash-note">
                Tổng học viên tham gia
              </p>

            </div>

            <div className="dash-card">

              <div className="dash-card-icon">
                <Activity size={28} />
              </div>

              <div className="dash-number">
                {getStatValue(3)}
              </div>

              <h3>Đang hoạt động</h3>

              <p className="dash-note">
                Hoạt động học tập gần đây
              </p>

            </div>

          </section>

         <section className="dash-panel">

  <div className="panel-header">
    <h2 className="dash-panel-title">
      Thao tác nhanh
    </h2>

    <span className="panel-subtitle">
      Truy cập nhanh các chức năng thường dùng
    </span>
  </div>

 <div className="quick-actions">

  <button className="quick-card create">
    <div className="quick-icon">
      <PlusCircle size={26} />
    </div>

    <div className="quick-content">
      <h4>Tạo khóa học</h4>
      <p>Tạo khóa học mới cho học viên</p>
    </div>

    <span className="quick-arrow">→</span>
  </button>

  <button className="quick-card course">
    <div className="quick-icon">
      <BookOpen size={26} />
    </div>

    <div className="quick-content">
      <h4>Quản lý khóa học</h4>
      <p>Chỉnh sửa và cập nhật khóa học</p>
    </div>

    <span className="quick-arrow">→</span>
  </button>

  <button className="quick-card student">
    <div className="quick-icon">
      <UserPlus size={26} />
    </div>

    <div className="quick-content">
      <h4>Học viên</h4>
      <p>Theo dõi tiến độ học tập</p>
    </div>

    <span className="quick-arrow">→</span>
  </button>

  <button className="quick-card chart">
    <div className="quick-icon">
      <BarChart3 size={26} />
    </div>

    <div className="quick-content">
      <h4>Báo cáo</h4>
      <p>Phân tích hiệu suất khóa học</p>
    </div>

    <span className="quick-arrow">→</span>
  </button>

</div>

</section>
          {/* COURSES */}

          <section className="dash-panel">

            <div className="panel-header">

              <h2 className="dash-panel-title">
                Khóa học gần đây
              </h2>

              <span className="panel-count">
                {courses.length} khóa học
              </span>

            </div>

            {courses.length === 0 ? (
              <div className="empty-state">
                Chưa có khóa học nào
              </div>
            ) : (
              <div className="dash-table-wrap">

                <table className="dash-table">

                  <thead>
                    <tr>
                      <th>Tên khóa học</th>
                      <th>Loại</th>
                      <th>Học viên</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>

                  <tbody>

                    {courses.map((course) => (
                      <tr key={course.id}>

                        <td>
                          {course.name}
                        </td>

                        <td>
                          <span className="course-badge">
                            {course.courseType ||
                              "FREE"}
                          </span>
                        </td>

                        <td>
                          {course.enrollmentCount ||
                            0}
                        </td>

                        <td>
                          <span
                            className={
                              course.published
                                ? "status-published"
                                : "status-draft"
                            }
                          >
                            {course.published
                              ? "Published"
                              : "Draft"}
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </section>

          {/* STUDENTS */}

          <section className="dash-panel">

            <div className="panel-header">

              <h2 className="dash-panel-title">
                Học viên mới
              </h2>

              <span className="panel-count">
                {enrollments.length}
              </span>

            </div>

            {enrollments.length === 0 ? (
              <div className="empty-state">
                Chưa có học viên nào
              </div>
            ) : (
              <div className="dash-table-wrap">

                <table className="dash-table">

                  <thead>
                    <tr>
                      <th>Học viên</th>
                      <th>Khóa học</th>
                      <th>Tiến độ</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>

                  <tbody>

                    {enrollments.map(
                      (enrollment) => (
                        <tr
                          key={enrollment.id}
                        >

                          <td>
                            {enrollment.userName ||
                              enrollment.userId}
                          </td>

                          <td>
                            {enrollment.courseName ||
                              enrollment.courseId}
                          </td>

                          <td>

                            <div className="progress-cell">

                              <div className="table-progress">

                                <div
                                  className="table-progress-fill"
                                  style={{
                                    width: `${enrollment.progressPercentage || 0}%`,
                                  }}
                                />

                              </div>

                              <span>
                                {enrollment.progressPercentage || 0}
                                %
                              </span>

                            </div>

                          </td>

                          <td>
                            {enrollment.status}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </section>

          {/* ACTIVITY */}

          <section className="dash-panel">

            <div className="panel-header">

              <h2 className="dash-panel-title">
                Hoạt động gần đây
              </h2>

            </div>

            <ul className="activity-list">

              <li>
                📚 Học viên mới ghi danh khóa học
              </li>

              <li>
                📝 Một bài quiz vừa được hoàn thành
              </li>

              <li>
                🎓 Một học viên hoàn thành khóa học
              </li>

            </ul>

          </section>

        </>
      )}
    </div>
  );
}

export default MentorDashboardView;