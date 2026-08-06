import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { getAuthUser, getEnrollmentByCourse } from "../services/api";

function EnrollmentRoute({ children }) {
  const { courseId } = useParams();
  const location = useLocation();
  const user = getAuthUser();

  const [loading, setLoading] = useState(Boolean(courseId));
  const [allowed, setAllowed] = useState(!courseId);

  useEffect(() => {
    let isMounted = true;

    const checkEnrollment = async () => {
      if (!courseId) {
        return;
      }

      try {
        const response = await getEnrollmentByCourse(courseId);
        const enrollment = response.data || null;

        if (!isMounted) {
          return;
        }

        if (!enrollment) {
          setAllowed(false);
          return;
        }

        if (enrollment.paymentStatus !== "COMPLETED") {
          setAllowed(false);
          return;
        }

        setAllowed(true);
      } catch (error) {
        if (isMounted) {
          setAllowed(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkEnrollment();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!courseId) {
    return children;
  }

  if (loading) {
    return (
      <div className="empty-learning-state">
        <h2>Đang kiểm tra đăng ký...</h2>
        <p>Vui lòng chờ trong giây lát.</p>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to={`/courses/${courseId}`} replace />;
  }

  return children;
}

export default EnrollmentRoute;
