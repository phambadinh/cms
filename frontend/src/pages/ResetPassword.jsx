import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authResetPassword } from "../services/authApi";
import "../styles/auth.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenValue = searchParams.get("token") || "";
    setToken(tokenValue);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Token không hợp lệ. Vui lòng kiểm tra lại liên kết email.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập mật khẩu mới và xác nhận mật khẩu.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setSubmitting(true);

    try {
      await authResetPassword(token, newPassword);
      setMessage("Đặt lại mật khẩu thành công. Bạn có thể đăng nhập lại ngay.");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
        const responseData = err.response?.data;
        const msg = typeof responseData === "string" ? responseData : responseData?.message || err.message;
        setError(msg || "Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">CMS</h1>
        <h2 className="auth-title">Đặt lại mật khẩu</h2>
        <p className="auth-subtitle">
          Nhập mật khẩu mới để hoàn tất quá trình đặt lại mật khẩu.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Mật khẩu mới
            <input
              className="auth-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={submitting}
            />
          </label>

          <label className="auth-label">
            Xác nhận mật khẩu
            <input
              className="auth-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting}
            />
          </label>

          <button className="auth-button" type="submit" disabled={submitting}>
            {submitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
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

export default ResetPassword;
