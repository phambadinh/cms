// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authLogin, authLoginEmail, saveAuthData } from "../services/api";
import "../styles/auth.css";

export default function Login() {
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
      // Gọi API login từ backend
      const response = username.includes("@")
        ? await authLoginEmail(username, password)
        : await authLogin(username, password);
      const data = response.data;

      // Lưu token và user info
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

      // Điều hướng dựa trên role
      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const responseData = err.response?.data;
        const errorMessage = typeof responseData === "string" ? responseData : responseData?.message || err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
        setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">CMS</h1>

        <h2 className="auth-title">Đăng nhập hệ thống</h2>
        <p className="auth-subtitle">
          Vui lòng đăng nhập để tiếp tục.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Username
            <input
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
            />
          </label>

          <label className="auth-label">
            Password
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </label>

          <div className="auth-row">
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={submitting}
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
          </div>

          <button
            className="auth-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-link-row">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
          <span> · </span>
          <Link to="/register">Tạo tài khoản mới</Link>
        </div>
      </div>
    </div>
  );
}