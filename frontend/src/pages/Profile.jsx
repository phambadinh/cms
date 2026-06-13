import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUser, getUserProfile, updateUserProfile } from "../services/api";
import "../styles/profile.css";

function Profile() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        setFormData({
          username: res.data?.username || user.username || "",
          email: res.data?.email || user.email || "",
          fullName: res.data?.fullName || "",
          phone: res.data?.phone || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await updateUserProfile(formData);
      setMessage("Cập nhật thông tin thành công!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
        <div className="profile-card">
          <h2 className="profile-title">Cài đặt tài khoản</h2>
          <p className="profile-subtitle">Quản lý thông tin cá nhân của bạn</p>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                disabled
                className="form-input disabled"
              />
              <small>Tên đăng nhập không thể thay đổi</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="form-input disabled"
              />
              <small>Email không thể thay đổi</small>
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className="form-input"
              />
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/")}
              >
                Quay lại
              </button>
            </div>
          </form>

          <div className="profile-info">
            <h3>Thông tin tài khoản</h3>
            <div className="info-item">
              <span className="info-label">Vai trò:</span>
              <span className="info-value">{user?.role || "N/A"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Trạng thái:</span>
              <span className="info-value status-active">Hoạt động</span>
            </div>
          </div>
        </div>
      </div>
   );
}

export default Profile;
