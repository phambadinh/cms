// src/pages/Grades.jsx

import { useEffect, useState } from "react";
import {
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyGrades } from "../services/api";

import "../styles/grades.css";

function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyGrades();
        setGrades(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalCourses = grades.length;

  const passedCourses = grades.filter(
    (item) => (item.finalGrade || 0) >= 5
  ).length;

  const averageGrade =
    grades.length > 0
      ? (
          grades.reduce(
            (sum, item) => sum + (item.finalGrade || 0),
            0
          ) / grades.length
        ).toFixed(1)
      : 0;

  return (
    <div className="grades-page">
      {/* ================= HEADER ================= */}

      <div className="grades-hero">
        <h1>Điểm số của tôi</h1>

        <p>
          Theo dõi hiệu suất học tập của bạn và
          xem lại kết quả khóa học.
        </p>
      </div>

      {/* ================= STATS ================= */}

      <div className="grades-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>

          <h3>Tổng số khóa học</h3>

          <div className="value">
            {totalCourses}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={24} />
          </div>

          <h3>Đã hoàn thành</h3>

          <div className="value">
            {passedCourses}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>

          <h3>Điểm trung bình</h3>

          <div className="value">
            {averageGrade}
          </div>
        </div>
      </div>

      {/* ================= EMPTY ================= */}

      {loading ? (
        <div className="empty-grades">
          <h3>Loading...</h3>
        </div>
      ) : grades.length === 0 ? (
        <div className="empty-grades">
          <BookOpen
            size={72}
            color="#0056D2"
          />

          <h3>
            Chưa có điểm số nào
          </h3>

          <p>
            Điểm số của bạn sẽ xuất hiện ở đây sau khi
            hoàn thành các bài đánh giá khóa học.
          </p>
        </div>
      ) : (
        <>
          {/* ================= TITLE ================= */}

          <div className="section-title">
            Kết quả khóa học
          </div>

          {/* ================= GRID ================= */}

          <div className="grades-grid">
            {grades.map((item) => (
              <div
                key={item.id}
                className="grade-card"
              >
                {/* THUMBNAIL */}

                <div className="grade-banner">
                  {item.courseName
                    ?.charAt(0)
                    ?.toUpperCase() || "C"}
                </div>

                {/* BODY */}

                <div className="grade-card-content">
                  <div
                    className={`grade-status ${
                      (item.finalGrade || 0) >= 5
                        ? "passed"
                        : "failed"
                    }`}
                  >
                    {(item.finalGrade || 0) >= 5
                      ? "Passed"
                      : "Not Passed"}
                  </div>

                  <h3>
                    {item.courseName || "Course"}
                  </h3>

                  <div className="grade-meta">
                    Final Grade:{" "}
                    <span>
                      {item.finalGrade || 0}
                    </span>
                  </div>

                  <p>
                    Xem lại hiệu suất khóa học của bạn
                    và tiếp tục cải thiện kết quả học tập.
                  </p>

                  {/* SCORE */}

                  <div className="grade-progress">
                    <div className="grade-progress-label">
                      <span>
                        Điểm hoàn thành
                      </span>

                      <span>
                        {item.finalGrade || 0}/10
                      </span>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            ((item.finalGrade || 0) /
                              10) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    className="details-btn"
                    onClick={() =>
                      navigate(
                        `/learning/${item.courseId}`
                      )
                    }
                  >
                    Xem Khóa học

                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= NOTE ================= */}

          <div className="grades-tip">
            <div className="grades-tip-icon">
                <BookOpen size={28} />
            </div>

            <div>
              <h3>
                Mẹo học tập
              </h3>

              <p>
                Xem lại phản hồi thường xuyên giúp
                bạn cải thiện nhanh hơn so với chỉ tập trung
                vào điểm cuối cùng.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Grades;