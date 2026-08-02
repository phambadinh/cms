// src/pages/CourseDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCourseById,
  getAuthUser,
  enrollCourse,
  getEnrollmentByCourse,
} from "../services/api";
import "../styles/courseDetail.css";

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enrollmentInfo, setEnrollmentInfo] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const user = getAuthUser();

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");

      try {
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

    const courseIdentifier = course.id || course._id;

    if (course.courseType === "FREE") {
      setActionLoading(true);
      try {
        await enrollCourse(courseIdentifier);
        navigate(`/learning/${courseIdentifier}`);
        const res = await getEnrollmentByCourse(courseId);
        setEnrollmentInfo(res.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Ghi danh thất bại. Vui lòng thử lại.";
        if (errorMessage.includes("đăng ký") || errorMessage.includes("already")) {
          navigate(`/learning/${courseIdentifier}`);
          return;
        }
        alert(errorMessage);
      } finally {
        setActionLoading(false);
      }
      return;
    }

    navigate(`/payment?courseId=${courseIdentifier}&step=review`);
  };

  const hasAccess = course
    ? course.courseType === "FREE"
      ? !!enrollmentInfo
      : enrollmentInfo?.paymentStatus === "COMPLETED"
    : false;

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
                    <p>
                      {enrollmentInfo.paymentStatus === "COMPLETED"
                        ? "Bạn đã đăng ký và hoàn tất thanh toán khóa học này."
                        : "Bạn đã tạo phiên đăng ký, vui lòng tiếp tục thanh toán để mở khóa nội dung."}
                    </p>
                    {hasAccess && (
                      <button
                        type="button"
                        className="course-detail-btn-primary"
                        onClick={() => navigate(`/learning/${course.id || course._id}`)}
                      >
                        Vào kênh học
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      className="course-detail-btn-primary"
                      onClick={handleCourseAction}
                      disabled={actionLoading}
                    >
                      {course.courseType === "FREE"
                        ? actionLoading
                          ? "Đang ghi danh..."
                          : "Ghi danh"
                        : actionLoading
                        ? "Đang mở trang thanh toán..."
                        : enrollmentInfo?.paymentStatus === "PENDING"
                        ? "Tiếp tục thanh toán"
                        : "Đăng ký ngay"}
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          <div className="course-detail-payment-box">
            <h3>Quyền truy cập nội dung</h3>
            {hasAccess ? (
              <p>Bạn đã có quyền học khóa này. Chọn "Vào kênh học" để bắt đầu.</p>
            ) : (
              <p>Bạn cần ghi danh hoặc hoàn tất thanh toán để mở kênh nội dung học và kênh đánh giá.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default CourseDetail;