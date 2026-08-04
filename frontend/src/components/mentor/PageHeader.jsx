// src/components/mentor/PageHeader.jsx
import { RotateCw } from "lucide-react";

function MentorPageHeader({ eyebrow, title, subtitle, actions, onReload, reloading }) {
  return (
    <div className="mentor-page-header">
      <div>
        {eyebrow && <p className="mentor-page-eyebrow">{eyebrow}</p>}
        <h1 className="mentor-page-title">{title}</h1>
        {subtitle && <p className="mentor-page-subtitle">{subtitle}</p>}
      </div>

      <div className="mentor-page-actions">
        {actions}
        {onReload && (
          <button
            className="mentor-button is-secondary"
            type="button"
            onClick={onReload}
            disabled={reloading}
          >
            <RotateCw size={16} className={reloading ? "mentor-spin-icon" : ""} />
            Tải lại
          </button>
        )}
      </div>
    </div>
  );
}

export default MentorPageHeader;