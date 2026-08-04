import React, { useEffect, useState } from "react";
import "../styles/LearningProgress.css";

import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Users,
  Eye,
  Globe,
  GraduationCap,
} from "lucide-react";

import { getStudentDashboard } from "../services/api";

function LearningProgress() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getStudentDashboard();
        setDashboard(res.data);
      } catch (err) {
        console.error("Load dashboard failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="learning-progress-page">
        <h2>Đang tải dữ liệu...</h2>
      </div>
    );
  }

  const getStat = (label) =>
    dashboard?.stats?.find((s) => s.label === label)?.value || "0";

  const enrolledCourses = getStat("Khóa đã đăng ký");
  const activeCourses = getStat("Đang học");
  const completedCourses = getStat("Đã hoàn thành");
  const completedLessons = getStat("Bài học hoàn thành");
  const quizAttempts = getStat("Lượt quiz");
  const averageProgress = getStat("Tỷ lệ hoàn thành");

  return (
    <div className="learning-progress-page">
      {/* Hero */}
      <div className="progress-hero">
        <h1 className="hero-title">
          <TrendingUp size={38} />
          Tiến độ học tập
        </h1>

        <p>
          Theo dõi hành trình học tập, tiến độ hoàn thành và kết quả các khóa
          học của bạn.
        </p>
      </div>

      {/* Statistics */}
      <div className="progress-stats">
        <div className="stat-card">
          <BookOpen size={34} />
          <h3>{enrolledCourses}</h3>
          <p>Khóa học đã đăng ký</p>
        </div>

        <div className="stat-card">
          <Target size={34} />
          <h3>{averageProgress}%</h3>
          <p>Tiến độ trung bình</p>
        </div>

        <div className="stat-card">
          <Trophy size={34} />
          <h3>{completedCourses}</h3>
          <p>Khóa học hoàn thành</p>
        </div>

        <div className="stat-card">
          <TrendingUp size={34} />
          <h3>{quizAttempts}</h3>
          <p>Quiz đã làm</p>
        </div>
      </div>

      {/* Current Progress */}
      <div className="progress-course-card">
        <div className="course-header">
          <h2 className="section-title">
            <GraduationCap size={24} />
            Khóa học đang học
          </h2>

          <span>{activeCourses}</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(
                parseFloat(averageProgress || 0),
                100
              )}%`,
            }}
          />
        </div>

        <p>
          Bạn đã hoàn thành{" "}
          <strong>{completedLessons}</strong> bài học.
        </p>
      </div>

      {/* Course List */}
      {dashboard?.courses?.length > 0 && (
        <>
          <h2 className="my-course-title">
            <BookOpen size={30} />
            Khóa học của tôi
          </h2>

          {dashboard.courses.map((course) => (
            <div
              key={course.id}
              className="progress-course-card"
            >
              <div className="course-header">
                <h2>{course.name}</h2>

                <span>{course.courseType}</span>
              </div>

              <div className="course-meta">
                <div className="meta-item">
                  <Users size={18} />
                  <span>
                    {course.enrollmentCount} học viên
                  </span>
                </div>

                <div className="meta-item">
                  <Eye size={18} />
                  <span>
                    {course.viewCount} lượt xem
                  </span>
                </div>

                <div className="meta-item">
                  <Globe size={18} />
                  <span>
                    {course.published
                      ? "Đã công bố"
                      : "Chưa công bố"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default LearningProgress;