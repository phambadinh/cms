// src/pages/Grades.jsx
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
  ClipboardList,
  Users,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getAuthUser,
  getGradesByCourse,
  getMyCreatedCourses,
  getMyGrades,
} from "../services/api";

import "../styles/grades.css";

function formatScore(value) {
  const score = Number(value || 0);
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scopeLabel, setScopeLabel] = useState("Học viên");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = getAuthUser();

        if (user?.role === "MENTOR" || user?.role === "ADMIN") {
          setScopeLabel("Mentor");
          const coursesResponse = await getMyCreatedCourses();
          const courses = coursesResponse.data || [];
          const results = await Promise.all(
            courses.map(async (course) => {
              try {
                const gradesResponse = await getGradesByCourse(course.id);
                return (gradesResponse.data || []).map((grade) => ({
                  ...grade,
                  courseName: course.name,
                  courseId: grade.courseId || course.id,
                }));
              } catch (err) {
                console.error(`Không tải được điểm của khóa ${course.name}:`, err);
                return [];
              }
            })
          );

          setGrades(results.flat());
          return;
        }

        setScopeLabel("Học viên");
        const response = await getMyGrades();
        setGrades(response.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalCourses = grades.length;

  const passedCourses = grades.filter((item) => (item.score ?? item.finalGrade ?? 0) >= 5).length;

  const averageGrade =
    grades.length > 0
      ? (
          grades.reduce((sum, item) => sum + Number(item.score ?? item.finalGrade ?? 0), 0) /
          grades.length
        ).toFixed(1)
      : 0;

  const uniqueStudents = useMemo(
    () => new Set(grades.map((item) => item.userId).filter(Boolean)).size,
    [grades]
  );

  return (
    <div className="grades-page">
      <div className="grades-hero">
        <div>
          <h1>{scopeLabel === "Mentor" ? "Điểm số lớp học" : "Điểm số của tôi"}</h1>
          <p>
            {scopeLabel === "Mentor"
              ? "Theo dõi kết quả học viên theo từng khóa học và cập nhật điểm chấm nhanh hơn."
              : "Theo dõi hiệu suất học tập của bạn và xem lại kết quả khóa học."}
          </p>
        </div>
        <div className="grades-hero-actions">
          <div className="grades-hero-chip">
            <ClipboardList size={16} />
            <span>{grades.length} bản ghi</span>
          </div>
          <div className="grades-hero-chip">
            <BarChart3 size={16} />
            <span>{scopeLabel}</span>
          </div>
        </div>
      </div>

      <div className="grades-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <h3>{scopeLabel === "Mentor" ? "Khóa có điểm" : "Tổng số khóa học"}</h3>
          <div className="value">{totalCourses}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={24} />
          </div>
          <h3>{scopeLabel === "Mentor" ? "Học viên đạt" : "Đã hoàn thành"}</h3>
          <div className="value">{passedCourses}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <h3>Điểm trung bình</h3>
          <div className="value">{averageGrade}</div>
        </div>

        {scopeLabel === "Mentor" && (
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <h3>Học viên riêng</h3>
            <div className="value">{uniqueStudents}</div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="empty-grades">
          <h3>Đang tải...</h3>
        </div>
      ) : grades.length === 0 ? (
        <div className="empty-grades">
          <BookOpen size={72} color="#0056D2" />
          <h3>{scopeLabel === "Mentor" ? "Chưa có điểm nào" : "Chưa có điểm số nào"}</h3>
          <p>
            {scopeLabel === "Mentor"
              ? "Điểm số của học viên sẽ xuất hiện ở đây sau khi bạn chấm hoặc cập nhật kết quả học tập."
              : "Điểm số của bạn sẽ xuất hiện ở đây sau khi hoàn thành các bài đánh giá khóa học."}
          </p>
        </div>
      ) : (
        <>
          <div className="section-title">
            {scopeLabel === "Mentor" ? "Bảng điểm học viên" : "Kết quả khóa học"}
          </div>

          <div className="grades-grid">
            {grades.map((item) => {
              const score = Number(item.score ?? item.finalGrade ?? 0);
              const passed = score >= 5;

              return (
                <div key={item.id} className="grade-card">
                  <div className="grade-banner">
                    {item.courseName?.charAt(0)?.toUpperCase() || "C"}
                  </div>

                  <div className="grade-card-content">
                    <div className={`grade-status ${passed ? "passed" : "failed"}`}>
                      {passed ? "Đạt" : "Chưa đạt"}
                    </div>

                    <h3>{item.courseName || "Khóa học"}</h3>

                    <div className="grade-meta">
                      Điểm: <span>{formatScore(score)}</span>
                    </div>

                    {scopeLabel === "Mentor" ? (
                      <p>
                        Học viên: <strong>{item.userId || "Không rõ"}</strong>
                      </p>
                    ) : (
                      <p>
                        Xem lại hiệu suất khóa học của bạn và tiếp tục cải thiện kết quả học tập.
                      </p>
                    )}

                    <div className="grade-progress">
                      <div className="grade-progress-label">
                        <span>Điểm hoàn thành</span>
                        <span>{formatScore(score)}/10</span>
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${Math.min((score / 10) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <button
                      className="details-btn"
                      onClick={() =>
                        navigate(
                          item.courseId
                            ? scopeLabel === "Mentor"
                              ? `/courses/${item.courseId}`
                              : `/learning/${item.courseId}`
                            : scopeLabel === "Mentor"
                              ? "/mentor/courses"
                              : "/courses"
                        )
                      }
                    >
                      Xem khóa học
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grades-tip">
            <div className="grades-tip-icon">
              <BookOpen size={28} />
            </div>

            <div>
              <h3>Mẹo học tập</h3>
              <p>
                Xem lại phản hồi thường xuyên giúp bạn cải thiện nhanh hơn so với chỉ tập trung vào
                điểm cuối cùng.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Grades;