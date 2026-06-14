import { Award } from "lucide-react";

function Certificate() {
  return (
    <div className="layout-main dashboard-shell">
      <h1 className="dash-title">Chứng chỉ của tôi</h1>

      <p className="dash-subtitle">
        Danh sách các chứng chỉ đã đạt được.
      </p>

      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <Award
          size={70}
          color="#2563eb"
        />

        <h2>Chưa có chứng chỉ nào</h2>

        <p>
          Hoàn thành khóa học để nhận
          chứng chỉ.
        </p>
      </div>
    </div>
  );
}

export default Certificate;