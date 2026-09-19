import { MessageSquare, RefreshCw } from "lucide-react";
import "../../styles/dashboard.css";

function AdminFeedbackPage() {
  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-module-title">Phản hồi</h1>
          <p className="admin-module-subtitle">
            Theo dõi ý kiến và đánh giá từ người dùng.
          </p>
        </div>

        <button type="button" className="admin-module-button">
          <RefreshCw size={18} style={{ marginRight: 6 }} />
          Làm mới
        </button>
      </div>

      <div className="admin-module-card">
        <div className="admin-empty-state">
          <MessageSquare size={32} aria-hidden="true" />
          <h2>Chưa có phản hồi</h2>
          <p>Phản hồi của người dùng sẽ được hiển thị tại đây.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminFeedbackPage;