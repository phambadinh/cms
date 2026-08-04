import { Heart } from "lucide-react";

function Wishlist() {
  return (
    <div className="layout-main dashboard-shell">
      <h1 className="dash-title">
        Danh sách yêu thích
      </h1>

      <p className="dash-subtitle">
        Các khóa học bạn đã lưu.
      </p>

      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <Heart
          size={70}
          color="#ef4444"
        />

        <h2>
          Chưa có khóa học yêu thích
        </h2>

        <p>
          Hãy thêm khóa học vào Wishlist.
        </p>
      </div>
    </div>
  );
}

export default Wishlist;