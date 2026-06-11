import { useState } from "react";
import { Link } from "react-router-dom";
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
      // Nếu backend có hỗ trợ forgot-password, có thể gọi API ở đây.
      // Hiện tại trang này chỉ giả lập thông báo gửi yêu cầu.
      setMessage(
        "Nếu email tồn tại, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu vào hòm thư của bạn."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra. Vui lòng thử lại sau."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">CMS</h1>
        <h2 className="auth-title">Quên mật khẩu</h2>
        <p className="auth-subtitle">
          Nhập email để lấy lại mật khẩu. Nếu hệ thống chưa hỗ trợ, bạn có thể liên hệ admin.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Email
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

        <div className="auth-link-row">
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default Forgetpassword;
