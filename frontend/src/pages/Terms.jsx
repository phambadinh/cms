import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/terms.css";
import { ShieldCheck, FileText, AlertTriangle } from "lucide-react";

function Terms() {
  return (
    <div className="terms-page">
      <Header />

      <section className="terms-hero">
        <div className="terms-hero-content">
          <h1 className="terms-hero-title">Điều Khoản Sử Dụng</h1>
          <p className="terms-hero-subtitle">
            Vui lòng đọc kỹ các điều khoản trước khi sử dụng hệ thống CMS Learning.
          </p>
        </div>
      </section>

      <section className="terms-section">
        <div className="terms-container">
          <div className="terms-card">
            <div className="terms-icon"><FileText size={24} /></div>
            <h3>1. Quy định chung</h3>
            <p>
              Người dùng đồng ý tuân thủ các quy định, không sử dụng hệ thống cho mục đích vi phạm pháp luật hoặc gây ảnh hưởng đến hệ thống.
            </p>
          </div>

          <div className="terms-card">
            <div className="terms-icon"><ShieldCheck size={24} /></div>
            <h3>2. Bảo mật tài khoản</h3>
            <p>
              Người dùng có trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh từ tài khoản của mình.
            </p>
          </div>

          <div className="terms-card">
            <div className="terms-icon"><AlertTriangle size={24} /></div>
            <h3>3. Vi phạm điều khoản</h3>
            <p>
              Chúng tôi có quyền tạm khóa hoặc chấm dứt quyền sử dụng nếu phát hiện hành vi vi phạm hoặc gây nguy cơ cho hệ thống.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Terms;