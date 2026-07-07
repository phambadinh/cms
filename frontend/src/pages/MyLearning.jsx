// src/pages/MyLearning.jsx

import { useEffect, useState } from "react";
import { BookOpen, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyEnrollments } from "../services/api";
import "../styles/myLearning.css";

function MyLearning() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyEnrollments();
        setEnrollments(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const total = enrollments.length;

  const completed = enrollments.filter(
    (e) => e.status === "COMPLETED"
  ).length;

  const inProgress = enrollments.filter(
    (e) => e.status === "ACTIVE"
  ).length;

  return (
    <div className="my-learning-page">
      <h1>Khóa học của tôi</h1>

      <div className="learning-stats">
        <div className="stat-card">
          <BookOpen size={22} />
          <h3>{total}</h3>
          <p>Tổng khóa học</p>
        </div>

        <div className="stat-card">
          <Clock size={22} />
          <h3>{inProgress}</h3>
          <p>Đang học</p>
        </div>

        <div className="stat-card">
          <CheckCircle size={22} />
          <h3>{completed}</h3>
          <p>Hoàn thành</p>
        </div>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="my-courses-grid">
          {enrollments.map((item) => (
            <div
              key={item.id}
              className="my-course-card"
            >
              <h3>{item.courseName || item.courseId}</h3>

              <p>
                Tiến độ:
                {" "}
                {item.progressPercentage || 0}%
              </p>

              <button
                onClick={() =>
                  navigate(
                    `/learning/${item.courseId}`
                  )
                }
              >
                Tiếp tục học
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyLearning;