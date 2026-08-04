// src/components/student/LearningStats.jsx

import {
  BookOpen,
  Trophy,
  Clock,
} from "lucide-react";

function LearningStats({
  totalCourses = 0,
  completedCourses = 0,
  learningCourses = 0,
}) {
  return (
    <div className="stats-grid">

      <div className="stat-card">
        <BookOpen />

        <h3>
          {totalCourses}
        </h3>

        <p>Tổng khóa học</p>
      </div>

      <div className="stat-card">
        <Trophy />

        <h3>
          {completedCourses}
        </h3>

        <p>Hoàn thành</p>
      </div>

      <div className="stat-card">
        <Clock />

        <h3>
          {learningCourses}
        </h3>

        <p>Đang học</p>
      </div>

    </div>
  );
}

export default LearningStats;