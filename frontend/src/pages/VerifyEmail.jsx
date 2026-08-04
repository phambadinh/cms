import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authVerifyEmail } from "../services/authApi";
import "../styles/auth.css";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Đang xác minh email...");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Thiếu token xác minh.");
      setMessage("");
      return;
    }

    const verify = async () => {
      try {
        const response = await authVerifyEmail(token);
        setMessage(response.data?.message || "Xác minh email thành công.");
        setError("");
      } catch (err) {
        const responseData = err.response?.data;
        setError(typeof responseData === "string" ? responseData : responseData?.message || "Không thể xác minh email.");
        setMessage("");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="auth-page">
      <div className="auth-card verify-card">
        <h1 className="auth-logo">CMS</h1>
        <h2 className="auth-title">Xác minh email</h2>
        <p className="auth-subtitle">
          Hoàn tất bước cuối cùng để kích hoạt tài khoản của bạn.
        </p>

        {message && <p className="auth-success">{message}</p>}
        {error && <p className="auth-error">{error}</p>}

        <div className="auth-link-row auth-link-row--center">
          <Link to="/login">Đi tới đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;