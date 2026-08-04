// src/components/mentor/EmptyState.jsx
function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="mentor-empty">
      {Icon && <Icon size={40} strokeWidth={1.5} aria-hidden="true" />}
      <p className="mentor-empty-title">{title}</p>
      {description && <p className="mentor-empty-desc">{description}</p>}
    </div>
  );
}

export default EmptyState;