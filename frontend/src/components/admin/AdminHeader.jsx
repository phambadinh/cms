import { useNavigate } from "react-router-dom";
import { authLogout, getAuthUser } from "../../services/api";
import {
    Globe,
    Bell,
    Settings,
    LogOut,
    UserRound
} from "lucide-react";
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
        <div className="admin-header-kicker">CMS</div>
        <div className="admin-header-title">Dashboard CMS</div>
      </div>
      <div className="admin-header-actions">
        <button className="admin-header-link" onClick={() => navigate("/")}>
          <Globe />
        </button>
        <div className="admin-header-user">
          <div className="admin-avatar">{(user?.fullName || user?.username || <UserRound size={20} />)[0]}</div>
          <div>
            <div className="admin-header-name">{user?.fullName || user?.username || "Admin"}</div>
            <div className="admin-header-role">Admin</div>
          </div>
        </div>
        <button className="admin-header-logout" onClick={handleLogout}>
          <LogOut />
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;