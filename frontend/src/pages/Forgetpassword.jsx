import { useState } from "react";
import { Link } from "react-router-dom";
import { authForgotPassword } from "../services/authApi";
import { CheckCircle2, ShieldCheck, Clock3 } from "lucide-react";
import "../styles/auth.css";

function Forgetpassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await authForgotPassword(email);
      const data = res.data;
      const submittedEmail = data && typeof data === "object" && data.email ? data.email : email;
      const responseMessage = data && typeof data === "object" && data.message ? data.message : "Nếu email tồn tại, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu vào hòm thư của bạn.";
      setMessage(`${responseMessage} (${submittedEmail})`);
      setEmail("");
    } catch (err) {
      const responseData = err.response?.data;
      const msg = typeof responseData === "string" ? responseData : responseData?.message || err.message;
      setError(msg || "Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page forgot-password-page">
      <div className="forgot-shell">
        <section className="forgot-hero card">
          <div className="forgot-brand-row">
            <span className="forgot-brand-mark">CMS</span>
            <span className="forgot-badge">Secure access</span>
          </div>

          <h1 className="forgot-hero-title">Khôi phục tài khoản để tiếp tục học liền mạch</h1>
          <p className="forgot-hero-copy">
            Nhập email bạn dùng để đăng ký. Chúng tôi sẽ gửi đường dẫn đặt lại mật khẩu vào hộp thư của bạn.
          </p>

          <div className="forgot-feature-list">
            <div className="forgot-feature-item">
              <CheckCircle2 size={18} className="forgot-feature-icon" />
              <span>Gửi email bảo mật trong vài giây</span>
            </div>
            <div className="forgot-feature-item">
              <ShieldCheck size={18} className="forgot-feature-icon" />
              <span>Không hiển thị link reset trên màn hình</span>
            </div>
            <div className="forgot-feature-item">
              <Clock3 size={18} className="forgot-feature-icon" />
              <span>Thiết kế gọn, rõ ràng, dễ thao tác trên mọi thiết bị</span>
            </div>
          </div>

          <div className="forgot-stats">
            <div className="forgot-stat">
              <strong>01</strong>
              <span>Email nhận link</span>
            </div>
            <div className="forgot-stat">
              <strong>60m</strong>
              <span>Link hết hạn</span>
            </div>
          </div>
        </section>

        <section className="auth-card forgot-panel">
          <div className="forgot-panel-top">
            <p className="auth-logo">CMS</p>
            <h2 className="auth-title">Quên mật khẩu</h2>
            <p className="auth-subtitle">
              Nhập email để lấy lại mật khẩu. Nếu hệ thống chưa hỗ trợ, bạn có thể liên hệ admin.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">
              Email
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@gmail.com"
                disabled={submitting}
              />
            </label>

            <button
              className="auth-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Đang xử lý..." : "Gửi yêu cầu"}
            </button>
          </form>

          {message && <p className="auth-success">{message}</p>}
          {error && <p className="auth-error">{error}</p>}

          <div className="auth-link-row auth-link-row--center">
            <Link to="/login">Quay lại đăng nhập</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Forgetpassword;
