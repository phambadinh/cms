import { useEffect, useState } from "react";
import { getStudentDashboard } from "../services/api";
import DashboardView from "../components/dashboard/DashboardView";

function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getStudentDashboard();
        setData(response.data);
      } catch (err) {
        console.error("Error loading student dashboard:", err);
        setError("Không thể tải dashboard student");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <DashboardView
      title={data?.title || "Student Dashboard"}
      subtitle={data?.subtitle || "Theo dõi tiến độ học tập và các khóa đã đăng ký."}
      stats={data?.stats || []}
      courses={data?.courses || []}
      enrollments={data?.enrollments || []}
      loading={loading}
      error={error}
    />
  );
}

export default StudentDashboard;