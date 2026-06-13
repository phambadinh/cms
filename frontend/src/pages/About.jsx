import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/about.css";
import {
  Target,
  Rocket,
  BookOpen,
  GraduationCap,
  Clock3,
  Users,
  BadgeDollarSign,
  BadgeCheck,
  Briefcase,
  Code2,
  UserCog,
  Wrench,
} from "lucide-react";

function About() {
  return (
    <div className="about-page">
      <Header />

      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">Về CMS Learning</h1>
          <p className="about-hero-subtitle">
            Nền tảng học tập trực tuyến hàng đầu tại Việt Nam, đồng hành cùng hàng ngàn ngành học
            với chính phục công nghệ
          </p>
        </div>
      </section>

      <section className="mission-vision">
        <div className="mission-vision-container">
          <div className="mission-vision-item">
            <div className="mission-vision-icon"><Target size={28} /></div>
            <h3>Sứ Mệnh</h3>
            <p>
              Cung cấp giáo dục công nghệ chất lượng cao, giúp mọi người tối ưu hóa kỹ năng lập trình và phát triển sự
              nghiệp trong ngành IT. Chúng tôi tin rằng kỹ năng lập trình là chìa khóa để mở ra cơ hội học tập và thành
              công trong toàn cầu.
            </p>
          </div>

          <div className="mission-vision-item">
            <div className="mission-vision-icon"><Rocket size={28} /></div>
            <h3>Tầm Nhìn</h3>
            <p>
              Trở thành nền tảng học tập công nghệ hàng đầu khu vực Đông Nam Á, cung cấp khóa học chất lượng cao với
              giáo viên giàu kinh nghiệm và môi trường học tập hiện đại, giúp học viên phát triển toàn diện.
            </p>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <h2 className="stats-title">Thống Kê Nổi Bật</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Học viên</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">30+</div>
            <div className="stat-label">Khóa học</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">15+</div>
            <div className="stat-label">Giảng viên</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">98%</div>
            <div className="stat-label">Hài lòng</div>
          </div>
        </div>
      </section>

      <section className="why-choose-us">
        <div className="why-choose-us-container">
          <h2>Tại sao chọn CMS Learning?</h2>
          <div className="why-choose-us-grid">
            <div className="why-item">
              <div className="why-icon"><BookOpen size={24} /></div>
              <h4>Khóa học chất lượng</h4>
              <p>Được thiết kế bởi các chuyên gia công nghệ hàng đầu</p>
            </div>

            <div className="why-item">
              <div className="why-icon"><GraduationCap size={24} /></div>
              <h4>Giảng viên giàu kinh nghiệm</h4>
              <p>Hơn 15 năm kinh nghiệm trong ngành công nghệ</p>
            </div>

            <div className="why-item">
              <div className="why-icon"><BadgeCheck size={24} /></div>
              <h4>Chứng chỉ công nhận</h4>
              <p>Nhận chứng chỉ sau khi hoàn thành khóa học</p>
            </div>

            <div className="why-item">
              <div className="why-icon"><Clock3 size={24} /></div>
              <h4>Học theo lịch của bạn</h4>
              <p>Truy cập khóa học bất kỳ lúc nào, ở đâu</p>
            </div>

            <div className="why-item">
              <div className="why-icon"><Users size={24} /></div>
              <h4>Cộng đồng hỗ trợ</h4>
              <p>Diễn đàn trao đổi với hàng ngàn học viên khác</p>
            </div>

            <div className="why-item">
              <div className="why-icon"><BadgeDollarSign size={24} /></div>
              <h4>Giá cả phải chăng</h4>
              <p>Các khóa học miễn phí và trả phí với giá tốt nhất</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>Đội Ngũ Chúng Tôi</h2>
        <p className="team-subtitle">
          Một nhóm những người đam mê công nghệ, giáo dục và sáng tạo
        </p>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar"><Briefcase size={24} /></div>
            <h4>Nguyễn Văn A</h4>
            <p>Giám đốc & Sáng lập viên</p>
          </div>

          <div className="team-member">
            <div className="member-avatar"><Code2 size={24} /></div>
            <h4>Trần Minh B</h4>
            <p>Giảng viên hàng đầu</p>
          </div>

          <div className="team-member">
            <div className="member-avatar"><UserCog size={24} /></div>
            <h4>Phạm Thị C</h4>
            <p>Quản lý nội dung</p>
          </div>

          <div className="team-member">
            <div className="member-avatar"><Wrench size={24} /></div>
            <h4>Lê Công D</h4>
            <p>Kỹ sư phần mềm</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;