import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  getCourseById,
  getAuthUser,
  enrollCourse,
  getEnrollmentByCourse,
} from "../services/api";
import "../styles/courseDetail.css";

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enrollmentInfo, setEnrollmentInfo] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const user = getAuthUser();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const courseRes = await getCourseById(courseId);
        setCourse(courseRes.data);
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
    const fetchEnrollmentInfo = async () => {
      if (!course || !user) {
        setEnrollmentInfo(null);
        return;
      }

      try {
        const res = await getEnrollmentByCourse(courseId);
        setEnrollmentInfo(res.data || null);
      } catch {
        setEnrollmentInfo(null);
      }
    };

    fetchEnrollmentInfo();
  }, [course, user, courseId]);

  const redirectToLogin = () => {
    navigate("/login", {
      state: { from: location },
    });
  };

  const handleCourseAction = async () => {
    if (!user) {
      redirectToLogin();
      return;
    }

    if (!course) return;

    const courseIdentifier = course.id || course._id;

    if (course.courseType !== "FREE") {
      navigate(`/payment?courseId=${courseIdentifier}&step=review`);
      return;
    }

    try {
      setActionLoading(true);
      await enrollCourse(courseIdentifier);
      navigate(`/learning/${courseIdentifier}`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Ghi danh thất bại. Vui lòng thử lại.";

      if (
        errorMessage.toLowerCase().includes("đăng ký") ||
        errorMessage.toLowerCase().includes("already")
      ) {
        navigate(`/learning/${courseIdentifier}`);
        return;
      }

      alert(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const courseIdentifier = course?.id || course?._id;
  const isFreeCourse = course?.courseType === "FREE";
  const hasAccess = course
    ? isFreeCourse
      ? Boolean(enrollmentInfo)
      : enrollmentInfo?.paymentStatus === "COMPLETED"
    : false;

  const handleEnterLearning = () => {
    if (!user) {
      redirectToLogin();
      return;
    }

    if (courseIdentifier) {
      navigate(`/learning/${courseIdentifier}`);
    }
  };

  return (
    <div className="course-detail-page">
      <Header />

      <main>
        {loading && <p>Đang tải...</p>}
        {error && <p className="courses-error">{error}</p>}

        {course && (
          <>
            <header className="course-detail-header">
              <h1 className="course-detail-title">{course.name}</h1>
              <p className="course-detail-meta">
                Giảng viên: <strong>{course.instructorName || "Đang cập nhật"}</strong>
              </p>
              <p className="course-detail-description">
                {course.description || "Mô tả khóa học CMS."}
              </p>
            </header>

            <section className="course-detail-payment-box">
              <h3>Đăng ký khóa học</h3>
              <p>
                Loại khóa học: {" "}
                <strong>{isFreeCourse ? "Miễn phí" : "Trả phí"}</strong>
              </p>

              {!isFreeCourse && (
                <p>
                  Giá: {" "}
                  <strong>
                    {Number(course.price || 0).toLocaleString("vi-VN")} đ
                  </strong>
                </p>
              )}

              {enrollmentInfo ? (
                <div className="course-detail-enrollment-info">
                  <p>
                    Trạng thái đăng ký: {" "}
                    <strong>{enrollmentInfo.paymentStatus || "PENDING"}</strong>
                  </p>
                  <p>
                    {hasAccess
                      ? "Bạn đã có quyền truy cập khóa học này."
                      : "Bạn đã tạo phiên đăng ký. Vui lòng hoàn tất thanh toán để mở khóa nội dung."}
                  </p>

                  {hasAccess && (
                    <button
                      type="button"
                      className="course-detail-btn-primary"
                      onClick={handleEnterLearning}
                    >
                      Vào kênh học
                    </button>
                  )}

                  {!hasAccess && !isFreeCourse && (
                    <button
                      type="button"
                      className="course-detail-btn-primary"
                      onClick={() =>
                        navigate(`/payment?courseId=${courseIdentifier}&step=review`)
                      }
                    >
                      Tiếp tục thanh toán
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  className="course-detail-btn-primary"
                  onClick={handleCourseAction}
                  disabled={actionLoading}
                >
                  {isFreeCourse
                    ? actionLoading
                      ? "Đang ghi danh..."
                      : "Ghi danh miễn phí"
                    : "Đăng ký ngay"}
                </button>
              )}
            </section>

            <section className="course-detail-payment-box">
              <h3>Quyền truy cập nội dung</h3>
              {hasAccess ? (
                <p>Bạn đã có quyền học khóa này. Chọn “Vào kênh học” để bắt đầu.</p>
              ) : (
                <p>
                  Bạn cần ghi danh hoặc hoàn tất thanh toán để mở nội dung học và
                  bài đánh giá.
                </p>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CourseDetail;