import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import "../styles/admin-layout.css";

function AdminLayout() {
  return (
    <div className="admin-layout-shell">
      <AdminSidebar />
      <div className="admin-layout-body">
        <AdminHeader />
        <main className="admin-layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;