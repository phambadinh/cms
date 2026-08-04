// src/components/mentor/MentorLayout.jsx
import { Outlet } from "react-router-dom";
import MentorSidebar from "./MentorSidebar";
import "../../styles/mentorSidebar.css";

function MentorLayout() {
  return (
    <div className="mentor-shell">
      <MentorSidebar />
      <main className="mentor-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MentorLayout;