import { useNavigate } from "react-router-dom";
import { getAuthUser, authLogout } from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleLogout = () => {
    authLogout();
    navigate("/login");
  };

  return (
    <header
      style={{
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "linear-gradient(90deg, #0f4c81, #2563eb 55%, #60a5fa)",
        color: "#fff",
        boxShadow: "0 10px 24px rgba(15,76,129,0.18)",
      }}
    >
      <div style={{ fontSize: "20px", fontWeight: 700 }}>CMS</div>
      <nav style={{ display: "flex", gap: "16px", fontSize: "14px" }}>
        {user && (
          <>
            <span>
              Chào {user.fullName || user.username} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.32)",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Đăng xuất
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;