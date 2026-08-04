// src/components/mentor/LoadingState.jsx
function LoadingState({ label = "Đang tải dữ liệu..." }) {
  return (
    <div className="mentor-loading">
      <span className="mentor-spinner" aria-label="Đang tải..." />
      <p>{label}</p>
    </div>
  );
}

export default LoadingState;