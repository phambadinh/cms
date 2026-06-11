// src/pages/Courses.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicCourses, enrollCourse, getAuthUser } from "../services/api";
import "../styles/layout.css";
import "../styles/courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState({});
  const navigate = useNavigate();
  const user = getAuthUser();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getPublicCourses();
        setCourses(res.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Không thể tải danh sách khóa học. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleEnroll = async (courseId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setEnrolling((prev) => ({ ...prev, [courseId]: true }));

    try {
      await enrollCourse(courseId);
      alert("Ghi danh khóa học thành công!");
      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error("Error enrolling course:", err);
      const errorMessage =
        err.response?.data?.message || "Ghi danh thất bại. Vui lòng thử lại.";
      alert(errorMessage);
    } finally {
      setEnrolling((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  return (
    <div className="layout">
      <div className="layout-body">
        <main className="layout-main">
          <h1 className="courses-title">Danh sách khóa học CMS</h1>
          <p className="courses-subtitle">
            Khóa học online trên nền tảng CMS.
          </p>

          {loading && <p>Đang tải...</p>}
          {error && <p className="courses-error">{error}</p>}

          <div className="courses-table-wrapper">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên khóa học</th>
                  <th>Giảng viên</th>
                  <th>Số bài giảng</th>
                  <th>Trình độ</th>
                  <th>Giá</th>
                  <th>Loại</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={course.id || course._id || index}>
                    <td>{index + 1}</td>
                    <td>{course.name || "N/A"}</td>
                    <td>{course.instructorName || "Updating"}</td>
                    <td>{course.totalLessons ?? 0}</td>
                    <td>{course.level || "N/A"}</td>
                    <td>
                      {course.courseType === "PREMIUM" && course.price != null
                        ? `${course.price.toLocaleString('vi-VN')} đ`
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={
                          course.courseType === "FREE"
                            ? "badge badge-free"
                            : "badge badge-premium"
                        }
                      >
                        {course.courseType === "FREE" ? "Miễn phí" : "Trả phí"}
                      </span>
                    </td>
                    <td className="courses-actions">
                      <button
                        className="btn-secondary"
                        onClick={() =>
                          handleViewCourse(course.id || course._id)
                        }
                      >
                        Xem chi tiết
                      </button>
                      <button
                        className="btn-primary"
                        onClick={() =>
                          course.courseType === "FREE"
                            ? handleEnroll(course.id || course._id)
                            : handleViewCourse(course.id || course._id)
                        }
                        disabled={enrolling[course.id || course._id]}
                      >
                        {course.courseType === "FREE"
                          ? enrolling[course.id || course._id]
                            ? "Đang ghi danh..."
                            : "Ghi danh"
                          : "Mua khóa học"}
                      </button>
                    </td>
                  </tr>
                ))}

                {courses.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      Chưa có khóa học nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Courses;