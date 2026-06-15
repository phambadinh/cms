import React from "react";
import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
} from "lucide-react";

function LearningProgress() {
  return (
    <div className="learning-progress-page">

      <div className="progress-hero">
        <h1>📈 Tiến độ học tập</h1>
        <p>
          Theo dõi hành trình học tập và hoàn thành
          các khóa học của bạn.
        </p>
      </div>

      <div className="progress-stats">

        <div className="stat-card">
          <BookOpen size={32} />
          <h3>12</h3>
          <p>Khóa học đang học</p>
        </div>

        <div className="stat-card">
          <Target size={32} />
          <h3>68%</h3>
          <p>Tiến độ trung bình</p>
        </div>

        <div className="stat-card">
          <Trophy size={32} />
          <h3>5</h3>
          <p>Chứng chỉ đạt được</p>
        </div>

        <div className="stat-card">
          <TrendingUp size={32} />
          <h3>120h</h3>
          <p>Tổng thời gian học</p>
        </div>

      </div>

      <div className="progress-course-card">

        <div className="course-header">
          <h2>HTML & CSS Cơ Bản</h2>
          <span>80%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: "80%" }}
          />
        </div>

        <p>
          Bạn đã hoàn thành 8/10 bài học.
        </p>

      </div>

      <div className="progress-course-card">

        <div className="course-header">
          <h2>JavaScript Nâng Cao</h2>
          <span>45%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: "45%" }}
          />
        </div>

        <p>
          Bạn đã hoàn thành 9/20 bài học.
        </p>

      </div>

    </div>
  );
}

export default LearningProgress;