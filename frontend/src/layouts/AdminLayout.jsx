import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import AdminSidebar from "../components/admin/AdminSidebar";
import "../styles/admin-layout.css";

function AdminLayout() {
  return (
    <div className="admin-layout-shell">
      <AdminSidebar />
      <div className="admin-layout-body">
        <Header />
        <main className="admin-layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;