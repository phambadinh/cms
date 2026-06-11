import { useEffect, useState } from "react";
import { getAdminDashboard } from "../services/api";
import AdminDashboardView from "../components/dashboard/AdminDashboardView";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboard();
        setData(response.data);
      } catch (err) {
        console.error("Error loading admin dashboard:", err);
        setError("Không thể tải dashboard admin");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <AdminDashboardView
      title={data?.title || "Admin Dashboard"}
      subtitle={data?.subtitle || "Tổng quan hệ thống, người dùng và hoạt động khóa học."}
      stats={data?.stats || []}
      charts={data?.charts || []}
      courses={data?.courses || []}
      mentors={data?.mentors || []}
      enrollments={data?.enrollments || []}
      loading={loading}
      error={error}
    />
  );
}

export default AdminDashboard;