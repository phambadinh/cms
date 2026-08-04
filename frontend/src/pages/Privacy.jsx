import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/privacy.css";
import { LockKeyhole, Database, Eye } from "lucide-react";

function Privacy() {
  return (
    <div className="privacy-page">
      <Header />

      <section className="privacy-hero">
        <div className="privacy-hero-content">
          <h1 className="privacy-hero-title">Chính Sách Bảo Mật</h1>
          <p className="privacy-hero-subtitle">
            Chúng tôi cam kết bảo vệ dữ liệu cá nhân của người dùng một cách an toàn và minh bạch.
          </p>
        </div>
      </section>

      <section className="privacy-section">
        <div className="privacy-container">
          <div className="privacy-card">
            <div className="privacy-icon"><Database size={24} /></div>
            <h3>Thu thập dữ liệu</h3>
            <p>
              Chúng tôi chỉ thu thập thông tin cần thiết để vận hành hệ thống, cải thiện trải nghiệm học tập và hỗ trợ người dùng.
            </p>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon"><Eye size={24} /></div>
            <h3>Sử dụng dữ liệu</h3>
            <p>
              Dữ liệu chỉ được sử dụng cho mục đích nội bộ, phân tích hệ thống và không chia sẻ trái phép với bên thứ ba.
            </p>
          </div>

          <div className="privacy-card">
            <div className="privacy-icon"><LockKeyhole size={24} /></div>
            <h3>Bảo vệ dữ liệu</h3>
            <p>
              Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phù hợp để bảo vệ dữ liệu khỏi truy cập trái phép.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Privacy;