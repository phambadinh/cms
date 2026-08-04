// src/components/mentor/MentorSidebar.jsx
import { NavLink } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { MENTOR_NAV } from "../../config/mentorNav";
import "../../styles/mentorSidebar.css";

function MentorSidebar() {
  return (
    <aside className="mentor-sidebar">
      <div className="mentor-sidebar-brand">
        <span className="mentor-sidebar-logo">CMS</span>
        <div>
          <p className="mentor-sidebar-title">Dashboard</p>
          <p className="mentor-sidebar-role">MENTOR</p>
        </div>
      </div>

      <nav className="mentor-sidebar-nav">
        {MENTOR_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `mentor-sidebar-item ${isActive ? "is-active" : ""}`}
            >
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mentor-sidebar-footer">
        <GraduationCap size={16} strokeWidth={2} aria-hidden="true" />
        <span>Mentor Workspace</span>
      </div>
    </aside>
  );
}

export default MentorSidebar;