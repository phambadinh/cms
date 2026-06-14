import "../../styles/dashboard.css";
function MentorDashboardView({ title, subtitle, stats = [], courses = [], enrollments = [], loading = false, error = "" }) {
  return (
    <div className="layout-main dashboard-shell">
      <h1 className="dash-title">{title}</h1>
      <p className="dash-subtitle">{subtitle}</p>

      {error && <p className="dash-error">{error}</p>}

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <section className="dash-cards">
            {stats.map((stat) => (
              <div className="dash-card" key={stat.label}>
                <h3>{stat.label}</h3>
                <p className="dash-number">{stat.value}</p>
                {stat.description && <p className="dash-note">{stat.description}</p>}
              </div>
            ))}
          </section>

          {courses.length > 0 && (
            <section className="dash-panel">
              <h2 className="dash-panel-title">Khóa học của tôi</h2>
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
                        <td>{course.name}</td>
                        <td>{course.courseType || "N/A"}</td>
                        <td>{course.enrollmentCount ?? 0}</td>
                        <td>{course.published ? "Published" : "Draft"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {enrollments.length > 0 && (
            <section className="dash-panel">
              <h2 className="dash-panel-title">Học viên của tôi</h2>
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
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td>{enrollment.userName || enrollment.userId}</td>
                        <td>{enrollment.courseName || enrollment.courseId}</td>
                        <td>{enrollment.progressPercentage ?? 0}%</td>
                        <td>{enrollment.status || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default MentorDashboardView;
