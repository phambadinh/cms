// src/components/mentor/StatCard.jsx
function MentorStatCard({ icon: Icon, label, value, note, tone = "default" }) {
  return (
    <div className="mentor-stat-card">
      <div className={`mentor-stat-icon-wrap tone-${tone}`}>
        <Icon size={22} strokeWidth={2} className="mentor-stat-icon" aria-hidden="true" />
      </div>
      <div className="mentor-stat-body">
        <p className="mentor-stat-label">{label}</p>
        <p className="mentor-stat-value">{value ?? "—"}</p>
        {note && <p className="mentor-stat-note">{note}</p>}
      </div>
    </div>
  );
}

export default MentorStatCard;