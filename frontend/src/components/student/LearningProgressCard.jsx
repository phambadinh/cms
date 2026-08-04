// src/components/student/LearningProgressCard.jsx

function LearningProgressCard({
  progress = 0,
}) {
  return (
    <div className="learning-progress-card">

      <div className="progress-top">
        <span>Tiến độ</span>

        <span>
          {progress.toFixed(0)}%
        </span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

    </div>
  );
}

export default LearningProgressCard;