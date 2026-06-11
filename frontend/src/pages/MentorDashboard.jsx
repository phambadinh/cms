import { useEffect, useState } from "react";
import { getMentorDashboard } from "../services/api";
import DashboardView from "../components/dashboard/DashboardView";

function MentorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getMentorDashboard();
        setData(response.data);
      } catch (err) {
        console.error("Error loading mentor dashboard:", err);
        setError("Không thể tải dashboard mentor");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <DashboardView
      title={data?.title || "Mentor Dashboard"}
      subtitle={data?.subtitle || "Quản lý khóa học, học viên và kết quả học tập."}
      stats={data?.stats || []}
      courses={data?.courses || []}
      enrollments={data?.enrollments || []}
      loading={loading}
      error={error}
    />
  );
}

export default MentorDashboard;