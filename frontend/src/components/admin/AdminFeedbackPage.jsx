import { useEffect, useMemo, useState } from "react";
import { MessageSquareText, RefreshCw, Star, UserRound } from "lucide-react";
import "../../styles/dashboard.css";

const seedFeedback = [
  {
    id: "fb-1001",
    studentName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    courseName: "React Fundamentals",
    rating: 5,
    message: "Khóa học rất rõ ràng, giảng viên giải thích dễ hiểu và có nhiều ví dụ thực tế.",
    status: "NEW",
    createdAt: "2026-09-01T09:00:00Z",
  },
  {
    id: "fb-1002",
    studentName: "Trần Thị B",
    email: "tranthib@example.com",
    courseName: "Backend with Spring Boot",
    rating: 4,
    message: "Nội dung tốt, nhưng tôi muốn thêm bài tập thực hành hơn nữa.",
    status: "REVIEWED",
    createdAt: "2026-08-27T14:15:00Z",
  },
  {
    id: "fb-1003",
    studentName: "Lê Văn C",
    email: "levanc@example.com",
    courseName: "UI/UX Design",
    rating: 5,
    message: "Giao diện học tập dễ sử dụng, tôi rất hài lòng với trải nghiệm học tập.",
    status: "NEW",
    createdAt: "2026-08-20T16:40:00Z",
  },
];

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("vi-VN");
}

function AdminFeedbackPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setItems(seedFeedback);
          setLoading(false);
        }, 400);
      } catch (error) {
        console.error("Không tải được feedback:", error);
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const keyword = search.toLowerCase();
    return items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(keyword)
    );
  }, [items, search]);

  const stats = useMemo(() => ({
    total: items.length,
    newCount: items.filter((item) => item.status === "NEW").length,
    averageRating: items.length
      ? (items.reduce((sum, item) => sum + Number(item.rating || 0), 0) / items.length).toFixed(1)
      : "0.0",
  }), [items]);

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-module-title">Phản hồi</h1>
          <p className="admin-module-subtitle">Theo dõi phản hồi và đánh giá từ học viên.</p>
        </div>

        <div className="admin-module-actions">
          <button type="button" className="admin-module-button" onClick={() => setItems(seedFeedback)}>
            <RefreshCw size={18} style={{ marginRight: 6 }} />
            Làm mới
          </button>
        </div>
      </div>

      <div className="mentor-stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon"><MessageSquareText size={18} /></div>
          <div>
            <div className="stat-label">Tổng phản hồi</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Star size={18} /></div>
          <div>
            <div className="stat-label">Đánh giá TB</div>
            <div className="stat-value">{stats.averageRating}/5</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><UserRound size={18} /></div>
          <div>
            <div className="stat-label">Mới</div>
            <div className="stat-value">{stats.newCount}</div>
          </div>
        </div>
      </div>

      <div className="admin-module-card">
        <div className="admin-module-toolbar">
          <div className="table-search">
            <input
              placeholder="Tìm kiếm phản hồi..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <span>{filteredItems.length} bản ghi</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Học viên</th>
                <th>Khóa học</th>
                <th>Đánh giá</th>
                <th>Nội dung</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "24px" }}>Đang tải...</td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "24px" }}>Không có dữ liệu phản hồi.</td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.studentName}</td>
                    <td>{item.courseName}</td>
                    <td>{"★".repeat(Number(item.rating || 0))}{"☆".repeat(5 - Number(item.rating || 0))}</td>
                    <td>{item.message}</td>
                    <td>{item.status}</td>
                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminFeedbackPage;
