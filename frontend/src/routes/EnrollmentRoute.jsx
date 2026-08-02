import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { getAuthUser, getCourseById, getEnrollmentByCourse } from "../services/api";

function hasLearningAccess(course, enrollment) {
  if (!enrollment) {
    return false;
  }

  if (course?.courseType === "PREMIUM") {
    return enrollment.paymentStatus === "COMPLETED";
  }

  return true;
}

function EnrollmentRoute({ children }) {
  const { courseId } = useParams();
  const location = useLocation();
  const user = useMemo(() => getAuthUser(), []);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      if (user.role === "ADMIN" || user.role === "MENTOR") {
        setAllowed(true);
        setLoading(false);
        return;
      }

      try {
        const [courseRes, enrollmentRes] = await Promise.all([
          getCourseById(courseId),
          getEnrollmentByCourse(courseId),
        ]);

        const canAccess = hasLearningAccess(courseRes.data, enrollmentRes.data);
        setAllowed(canAccess);
      } catch (error) {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkEnrollment();
  }, [courseId, user]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (loading) {
    return <div style={{ padding: "24px" }}>Đang kiểm tra quyền truy cập khóa học...</div>;
  }

  if (!allowed) {
    return <Navigate to={`/courses/${courseId}`} replace state={{ from: location }} />;
  }

  return children;
}

export default EnrollmentRoute;