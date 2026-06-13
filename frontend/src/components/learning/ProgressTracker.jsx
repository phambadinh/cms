function ProgressTracker({
  current = 0
}) {
  return (
    <div className="progress-wrapper">

      <div className="progress-header">
        <span>Tiến độ học tập</span>

        <span>
          {current.toFixed(0)}%
        </span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${current}%`,
          }}
        />
      </div>

    </div>
  );
}

export default ProgressTracker;