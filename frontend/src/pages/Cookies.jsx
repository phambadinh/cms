import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/cookies.css";
import { Cookie, ShieldCheck, Settings2, Eye } from "lucide-react";

function Cookies() {
  return (
    <div className="cookies-page">
      <Header />

      <section className="cookies-hero">
        <div className="cookies-hero-content">
          <h1 className="cookies-hero-title">Chính Sách Cookie</h1>
          <p className="cookies-hero-subtitle">
            Chúng tôi sử dụng cookie để cải thiện trải nghiệm, cá nhân hóa nội dung và hỗ trợ vận hành hệ thống.
          </p>
        </div>
      </section>

      <section className="cookies-section">
        <div className="cookies-container">
          <div className="cookies-card">
            <div className="cookies-icon"><Cookie size={24} /></div>
            <h3>Cookie là gì?</h3>
            <p>
              Cookie là các tệp nhỏ được lưu trên trình duyệt để ghi nhớ thông tin và cải thiện trải nghiệm người dùng.
            </p>
          </div>

          <div className="cookies-card">
            <div className="cookies-icon"><Eye size={24} /></div>
            <h3>Mục đích sử dụng</h3>
            <p>
              Chúng tôi dùng cookie để ghi nhớ đăng nhập, phân tích hành vi sử dụng và tối ưu nội dung hiển thị.
            </p>
          </div>

          <div className="cookies-card">
            <div className="cookies-icon"><Settings2 size={24} /></div>
            <h3>Quản lý cookie</h3>
            <p>
              Người dùng có thể tùy chỉnh hoặc tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng có thể bị ảnh hưởng.
            </p>
          </div>

          <div className="cookies-card">
            <div className="cookies-icon"><ShieldCheck size={24} /></div>
            <h3>Bảo mật</h3>
            <p>
              Cookie được sử dụng có giới hạn, tuân thủ quy định bảo mật và không dùng để thu thập dữ liệu nhạy cảm trái phép.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Cookies;