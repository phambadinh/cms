import { NavLink } from "react-router-dom";
import { getAuthUser } from "../services/api";

function Sidebar() {
  const user = getAuthUser();
  const role = user?.role;

  const items =
    role === "ADMIN"
      ? [
          { to: "/dashboard", label: "Dashboard" },
          { to: "/courses", label: "Courses" },
          { to: "/students", label: "Students" },
          { to: "/teachers", label: "Teachers" },
          { to: "/grades", label: "Grades" },
          { to: "/progress", label: "Progress" },
        ]
      : role === "MENTOR"
      ? [
          { to: "/dashboard", label: "Dashboard" },
          { to: "/courses", label: "My Courses" },
          { to: "/lectures", label: "Lectures" },
          { to: "/grades", label: "Grades" },
          { to: "/progress", label: "Progress" },
        ]
      : [
          { to: "/dashboard", label: "Dashboard" },
          { to: "/courses", label: "Courses" },
          { to: "/grades", label: "Grades" },
          { to: "/progress", label: "Progress" },
        ];

  return (
    <aside style={{
      width: '240px',
      minHeight: 'calc(100vh - 64px)',
      padding: '24px',
      background: 'linear-gradient(180deg, #ffffff 0%, #f3f8ff 100%)',
      borderRight: '1px solid var(--cms-border)',
      boxShadow: '8px 0 24px rgba(15, 76, 129, 0.05)'
    }}>
      <div style={{ fontWeight: 700, color: 'var(--cms-blue-900)', marginBottom: '20px' }}>
        {role || 'Menu'}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              style={({ isActive }) => ({
                display: 'block',
                padding: '10px 12px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: isActive ? '#ffffff' : '#334155',
                background: isActive ? 'linear-gradient(135deg, #2563eb, #60a5fa)' : 'transparent',
                fontWeight: isActive ? 700 : 500,
              })}
              end={item.to === "/dashboard"}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar