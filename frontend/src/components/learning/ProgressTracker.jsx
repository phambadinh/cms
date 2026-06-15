function ProgressTracker({
  current = 0,
}) {
  const status =
    current >= 100
      ? "🎉 Hoàn thành"
      : current >= 70
      ? "🔥 Sắp hoàn thành"
      : current >= 30
      ? "📚 Đang học"
      : "🚀 Bắt đầu";

  return (
    <div className="progress-wrapper">

      <div className="progress-header">

        <div>
          <h4>Tiến độ học tập</h4>
          <p>{status}</p>
        </div>

        <div className="progress-percent">
          {current.toFixed(0)}%
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

    </div>
  );
}

export default ProgressTracker;