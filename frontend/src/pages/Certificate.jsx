import {
  Award,
  Trophy,
  Medal,
  Star,
} from "lucide-react";

function Certificate() {
  return (
    <div className="layout-main certificate-page">

      <div className="certificate-header">
        <h1>🏆 Chứng Chỉ Của Tôi</h1>

        <p>
          Theo dõi các chứng chỉ và thành tích
          bạn đã đạt được trong quá trình học tập.
        </p>
      </div>

      <div className="certificate-stats">

        <div className="cert-stat-card">
          <Award size={32} />
          <h3>0</h3>
          <p>Chứng chỉ</p>
        </div>

        <div className="cert-stat-card">
          <Trophy size={32} />
          <h3>0</h3>
          <p>Khóa học hoàn thành</p>
        </div>

        <div className="cert-stat-card">
          <Medal size={32} />
          <h3>0</h3>
          <p>Huy hiệu đạt được</p>
        </div>

        <div className="cert-stat-card">
          <Star size={32} />
          <h3>0</h3>
          <p>Đánh giá xuất sắc</p>
        </div>

      </div>

      <div className="certificate-empty">

        <div className="certificate-icon">
          <Award size={90} />
        </div>

        <h2>Chưa có chứng chỉ nào</h2>

        <p>
          Hoàn thành các khóa học và vượt qua
          bài kiểm tra cuối khóa để nhận chứng chỉ.
        </p>

        <button className="certificate-btn">
          Khám phá khóa học
        </button>

      </div>

    </div>
  );
}

export default Certificate;