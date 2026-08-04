// src/components/mentor/Badge.jsx
const TONE_CLASS = {
  free: "badge-free",
  premium: "badge-premium",
  live: "badge-live",
  draft: "badge-draft",
  completed: "badge-live",
  active: "badge-active",
  danger: "badge-danger",
};

function Badge({ tone = "draft", children }) {
  return <span className={`mentor-badge ${TONE_CLASS[tone] || "badge-draft"}`}>{children}</span>;
}

export default Badge;