// src/pages/MyLearning.jsx

import { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyEnrollments } from "../services/api";
import "../styles/myLearning.css";

import "../styles/myLearning.css";

function MyLearning() {
  const [enrollments, setEnrollments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res =
          await getMyEnrollments();

        setEnrollments(
          res.data || []
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const total = enrollments.length;

  const completed =
    enrollments.filter(
      (e) =>
        e.status === "COMPLETED"
    ).length;

  const inProgress =
    enrollments.filter(
      (e) =>
        e.status === "ACTIVE"
    ).length;

  return (
    <div className="my-learning-page">

      {/* HERO */}

      <div className="learning-hero">

        <h1>
          Khóa học của tôi
        </h1>

        <p>
          Theo dõi tiến độ học tập và tiếp tục
          hành trình chinh phục kiến thức.
        </p>

      </div>

      {/* STATS */}

      <div className="learning-stats">

        <div className="stat-card">

          <div className="stat-icon">
            <BookOpen size={28} />
          </div>

          <h3>
            Tổng khóa học
          </h3>

          <div className="value">
            {total}
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <Clock size={28} />
          </div>

          <h3>
            Đang học
          </h3>

          <div className="value">
            {inProgress}
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <CheckCircle size={28} />
          </div>

          <h3>
            Hoàn thành
          </h3>

          <div className="value">
            {completed}
          </div>

        </div>

      </div>

      {/* COURSE LIST */}

      {loading ? (
        <div className="empty-learning">

          <h3>
            Đang tải khóa học...
          </h3>

        </div>
      ) : enrollments.length === 0 ? (

        <div className="empty-learning">

          <div
            style={{
              fontSize: "70px",
              marginBottom: "20px",
            }}
          >
            📚
          </div>

          <h3>
            Chưa có khóa học nào
          </h3>

          <p>
            Hãy ghi danh khóa học đầu tiên
            để bắt đầu hành trình học tập.
          </p>

        </div>

      ) : (

        <>
          <div className="section-title">
            Khóa học đang tham gia
          </div>

          <div className="my-courses-grid">

            {enrollments.map(
              (item) => (
                <div
                  key={item.id}
                  className="my-course-card"
                >

                  {/* BANNER */}

                  <div className="course-banner">
                    📚
                  </div>

                  {/* CONTENT */}

                  <div className="my-course-card-content">

                    <div
                      className={`course-status ${
                        item.status ===
                        "COMPLETED"
                          ? "completed"
                          : "active"
                      }`}
                    >
                      {item.status ===
                      "COMPLETED"
                        ? "Hoàn thành"
                        : "Đang học"}
                    </div>

                    <h3>
                      {item.courseName ||
                        "Khóa học"}
                    </h3>

                    <div className="course-level">
                      Beginner
                    </div>

                    <p>
                      Tiếp tục hành trình học tập
                      và hoàn thành khóa học của bạn.
                    </p>

                    {/* PROGRESS */}

                    <div className="course-progress">

                      <div className="course-progress-label">

                        <span>
                          Tiến độ
                        </span>

                        <span>
                          {item.progressPercentage ||
                            0}
                          %
                        </span>

                      </div>

                      <div className="progress-bar">

                        <div
                          className="progress-fill"
                          style={{
                            width: `${
                              item.progressPercentage ||
                              0
                            }%`,
                          }}
                        />

                      </div>

                    </div>

                    <button
                      className="continue-btn"
                      onClick={() =>
                        navigate(
                          `/learning/${item.courseId}`
                        )
                      }
                    >
                      Tiếp tục học →
                    </button>

                  </div>

                </div>
              )
            )}

          </div>

          {/* STUDY TIP */}

          <div className="study-tip">

            <div className="study-tip-icon">
              💡
            </div>

            <div>

              <h3>
                Mẹo học tập
              </h3>

              <p>
                Duy trì học tập 30 phút mỗi ngày
                sẽ giúp bạn hoàn thành khóa học
                nhanh hơn và ghi nhớ kiến thức
                tốt hơn.
              </p>

            </div>

          </div>

        </>
      )}

    </div>
  );
}

export default MyLearning;