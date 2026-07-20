import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authRegister } from "../services/api";
import "../styles/auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !fullName || !password) {
      setError("Vui lòng điền đầy đủ thông tin đăng ký.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await authRegister({ username, email, fullName, password, role });
      setSuccess(response.data?.message || "Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản.");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      const responseData = err.response?.data;
      const msg = typeof responseData === "string" ? responseData : responseData?.message || err.message;
      setError(msg || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">CMS</h1>
        <h2 className="auth-title">Đăng ký tài khoản</h2>
        <p className="auth-subtitle">
          Tạo tài khoản mới và xác minh email để kích hoạt truy cập hệ thống.
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
            Email
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </label>

          <label className="auth-label">
            Họ và tên
            <input
              className="auth-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={submitting}
            />
          </label>

          <label className="auth-label">
            Mật khẩu
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </label>

          <label className="auth-label">
            Vai trò
            <select
              className="auth-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={submitting}
            >
              <option value="STUDENT">Học viên</option>
              <option value="MENTOR">Giảng viên</option>
            </select>
          </label>

          <button className="auth-button" type="submit" disabled={submitting}>
            {submitting ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        {success && <p className="auth-success">{success}</p>}
        {error && <p className="auth-error">{error}</p>}

        <div className="auth-link-row">
          <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
