// src/pages/CourseDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCourseById,
  getLessonsByCourse,
  getAuthUser,
  enrollCourse,
  getEnrollmentByCourse,
  initiateCoursePayment,
} from "../services/api";
import Quiz from "../pages/Quiz";
import "../styles/courseDetail.css";

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [enrollmentInfo, setEnrollmentInfo] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const user = getAuthUser();

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");

      try {
        const [courseRes, lessonsRes] = await Promise.all([
          getCourseById(courseId),
          getLessonsByCourse(courseId),
        ]);

        setCourse(courseRes.data);
        setLessons(lessonsRes.data || []);
      } catch (err) {
        console.error("Error fetching course detail:", err);
        setError("Không thể tải chi tiết khóa học. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [courseId]);

  useEffect(() => {
    if (lessons.length > 0 && !currentLesson) {
      setCurrentLesson(lessons[0]);
    }
  }, [lessons, currentLesson]);

  useEffect(() => {
    const fetchEnrollmentInfo = async () => {
      if (!course || !user) {
        return;
      }

      try {
        const res = await getEnrollmentByCourse(courseId);
        setEnrollmentInfo(res.data);
      } catch (err) {
        setEnrollmentInfo(null);
      }
    };

    fetchEnrollmentInfo();
  }, [course, user, courseId]);

  const handleCourseAction = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (course.courseType === "FREE") {
      setActionLoading(true);
      try {
        await enrollCourse(course.id || course._id);
        alert("Bạn đã ghi danh khóa học miễn phí thành công.");
        const res = await getEnrollmentByCourse(courseId);
        setEnrollmentInfo(res.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Ghi danh thất bại. Vui lòng thử lại.";
        alert(errorMessage);
      } finally {
        setActionLoading(false);
      }
      return;
    }

    setPaymentLoading(true);
    try {
      const res = await initiateCoursePayment({
        courseId: course.id || course._id,
        paymentMethod,
      });
      const paymentUrl = res.data?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Không thể khởi tạo thanh toán. Vui lòng thử lại sau.");
      }
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Lỗi khi khởi tạo thanh toán. Vui lòng thử lại.";
      alert(message);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="layout">
      <div className="layout-body">
        <main className="layout-main course-detail-page">
          {loading && <p>Đang tải...</p>}
          {error && <p className="courses-error">{error}</p>}

          {course && (
            <>
              <header className="course-detail-header">
                <h1 className="course-detail-title">{course.name}</h1>
                <p className="course-detail-meta">
                  Giảng viên:{" "}
                  <strong>{course.instructorName || "Đang cập nhật"}</strong>
                </p>
                <p className="course-detail-description">
                  {course.description || "Mô tả khóa học CMS."}
                </p>
              </header>

              <div className="course-detail-payment-box">
                <h3>Thanh toán khóa học</h3>
                <p>
                  Loại khóa học:{" "}
                  <strong>
                    {course.courseType === "FREE" ? "Miễn phí" : "Trả phí"}
                  </strong>
                </p>
                {course.courseType === "PREMIUM" && (
                  <p>
                    Giá: <strong>{course.price?.toLocaleString("vi-VN")} đ</strong>
                  </p>
                )}

                {enrollmentInfo ? (
                  <div className="course-detail-enrollment-info">
                    <p>
                      Trạng thái đăng ký: <strong>{enrollmentInfo.paymentStatus}</strong>
                    </p>
                    <p>Bạn đã đăng ký khóa học này.</p>
                  </div>
                ) : (
                  <>
                    {course.courseType === "PREMIUM" && (
                      <div className="course-detail-payment-method-group">
                        <label htmlFor="paymentMethod">Chọn cổng thanh toán:</label>
                        <select
                          id="paymentMethod"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                          <option value="VNPAY">VNPAY</option>
                          <option value="MOMO">MOMO</option>
                        </select>
                      </div>
                    )}

                    <button
                      className="course-detail-btn-primary"
                      onClick={handleCourseAction}
                      disabled={paymentLoading || actionLoading}
                    >
                      {course.courseType === "FREE"
                        ? actionLoading
                          ? "Đang ghi danh..."
                          : "Ghi danh"
                        : paymentLoading
                        ? "Đang chuyển tới cổng thanh toán..."
                        : "Thanh toán và ghi danh"}
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          <div className="course-detail-layout">
            <aside className="course-detail-sidebar">
              <h3>Nội dung khóa học</h3>
              <ul className="course-detail-lecture-list">
                {lessons.map((lesson) => (
                  <li
                    key={lesson.id || lesson._id}
                    className={
                      currentLesson?.id === lesson.id ||
                      currentLesson?._id === lesson._id
                        ? "course-detail-lecture-item active"
                        : "course-detail-lecture-item"
                    }
                    onClick={() => setCurrentLesson(lesson)}
                  >
                    <span className="course-detail-lecture-title">{lesson.title}</span>
                    <span className="course-detail-lecture-duration">
                      {lesson.duration
                        ? `${Math.floor(lesson.duration / 60)}:${String(
                            lesson.duration % 60
                          ).padStart(2, "0")}`
                        : "N/A"}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>

            <section className="course-detail-content">
              {currentLesson && (
                <>
                  <h2 className="course-detail-lecture-heading">{currentLesson.title}</h2>
                  <div className="course-detail-video-wrapper">
                    {currentLesson.videoUrl ? (
                      <video key={currentLesson.id} controls>
                        <source src={currentLesson.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="course-detail-video-empty">
                        Không có video cho bài học này
                      </div>
                    )}
                  </div>

                  <Quiz lessonId={currentLesson.id || currentLesson._id} />
                </>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CourseDetail;