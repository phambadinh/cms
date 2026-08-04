import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, LogIn, User, LockKeyhole, CircleAlert } from "lucide-react";
import { authLogin, saveAuthData } from "../services/api";
import "../styles/loginModal.css";

export default function LoginModal({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ Username hoặc email và Password.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await authLogin(username, password);
      const data = response.data;

      saveAuthData(data.token, {
        id: data.id || data.userId,
        userId: data.userId || data.id,
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      });

      if (remember) {
        localStorage.setItem("cms_remember", "true");
      } else {
        localStorage.removeItem("cms_remember");
      }

      onClose?.();

      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const responseData = err.response?.data;
      const errorMessage =
        typeof responseData === "string"
          ? responseData
          : responseData?.message ||
            err.message ||
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="login-modal-close"
          onClick={onClose}
          aria-label="Đóng đăng nhập"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="login-modal-brand">
          <div className="login-modal-brand-icon">
            <LogIn size={20} strokeWidth={2} />
          </div>
          <div>
            <h2 className="login-modal-title">Đăng nhập hệ thống</h2>
            <p className="login-modal-subtitle">Tiếp tục học tập và quản lý tài khoản của bạn.</p>
          </div>
        </div>

        <form className="login-modal-form" onSubmit={handleSubmit}>
          <label className="login-modal-label">
            Username
            <div className="login-modal-input-wrap">
              <User size={16} strokeWidth={2} className="login-modal-input-icon" />
              <input
                className="login-modal-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
                placeholder="Nhập username hoặc email"
              />
            </div>
          </label>

          <label className="login-modal-label">
            Password
            <div className="login-modal-input-wrap">
              <LockKeyhole size={16} strokeWidth={2} className="login-modal-input-icon" />
              <input
                className="login-modal-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                placeholder="Nhập mật khẩu"
              />
            </div>
          </label>

          <div className="login-modal-row">
            <label className="login-modal-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={submitting}
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>

            <Link to="/forgot-password" className="login-modal-inline-link" onClick={onClose}>
              Quên mật khẩu?
            </Link>
          </div>

          <button className="login-modal-button" type="submit" disabled={submitting}>
            {submitting ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        {error && (
          <div className="login-modal-error">
            <CircleAlert size={16} strokeWidth={2} />
            <span>{error}</span>
          </div>
        )}

        <div className="login-modal-footer">
          <span>Chưa có tài khoản?</span>
          <Link to="/register" onClick={onClose}>Tạo tài khoản mới</Link>
        </div>
      </div>
    </div>
  );
}