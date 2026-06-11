import { useNavigate } from "react-router-dom";
import { authLogout, getAuthUser } from "../../services/api";

function AdminHeader() {
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleLogout = () => {
    authLogout();
    navigate("/login");
  };

  return (
    <header className="admin-header">
      <div>
        <div className="admin-header-kicker">UTH Learning Admin</div>
        <div className="admin-header-title">Control Center</div>
      </div>
      <div className="admin-header-actions">
        <button className="admin-header-link" onClick={() => navigate("/")}>Xem website</button>
        <div className="admin-header-user">
          <div className="admin-avatar">{(user?.fullName || user?.username || "A")[0]}</div>
          <div>
            <div className="admin-header-name">{user?.fullName || user?.username || "Admin"}</div>
            <div className="admin-header-role">Admin</div>
          </div>
        </div>
        <button className="admin-header-logout" onClick={handleLogout}>Đăng xuất</button>
      </div>
    </header>
  );
}

export default AdminHeader;