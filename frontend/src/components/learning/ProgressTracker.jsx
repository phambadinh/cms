// src/components/learning/ProgressTracker.jsx

import {
  Trophy,
  BookOpen,
  TrendingUp,
} from "lucide-react";

function ProgressTracker({
  current = 0,
  totalLessons = 0,
}) {
  const completedLessons =
    totalLessons > 0
      ? Math.round((current / 100) * totalLessons)
      : 0;

  return (
    <div className="progress-wrapper">

      <div className="progress-header">

        <div>

          <h3>Tiến độ học tập</h3>

          <p>
            Theo dõi quá trình hoàn thành khóa học
          </p>

        </div>

        <div className="progress-percent">
          {Math.round(current)}%
        </div>

      </div>

      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width: `${current}%`,
          }}
        />

      </div>

      <div className="progress-stats">

        <div className="progress-card">

          <BookOpen size={22} />

          <div>

            <strong>
              {completedLessons}
            </strong>

            <span>
              Bài đã học
            </span>

          </div>

        </div>

        <div className="progress-card">

          <TrendingUp size={22} />

          <div>

            <strong>
              {Math.round(current)}%
            </strong>

            <span>
              Hoàn thành
            </span>

          </div>

        </div>

        <div className="progress-card">

          <Trophy size={22} />

          <div>

            <strong>
              {totalLessons}
            </strong>

            <span>
              Tổng bài học
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProgressTracker;