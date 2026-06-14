import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUser, authLogout } from "../services/api";
import "../styles/header.css";

function Header() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    authLogout();
    setIsProfileMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsProfileMenuOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <h1 className="logo-title">CMS</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="header-nav">
          <a 
            href="/" 
            className="nav-link active"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("/");
            }}
          >
            Trang chủ
          </a>
          <a 
            href="/courses" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("/courses");
            }}
          >
            Khóa học
          </a>
          <a 
            href="/about" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("/about");
            }}
          >
            Giới thiệu
          </a>
          <a 
            href="/contact" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("/contact");
            }}
          >
            Liên hệ
          </a>
        </nav>

        {/* Search Bar */}
        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            🔍
          </button>
        </form>

        {/* Profile Section */}
        <div className="header-profile">
          {user ? (
            <div className="profile-menu">
              <button
                className="profile-button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="profile-avatar">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>
              </button>

              {isProfileMenuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <p className="profile-name">{user.username}</p>
                    <p className="profile-role">{user.role}</p>
                  </div>
                  <hr />
                  <button
                    className="dropdown-item"
                    onClick={handleProfileClick}
                  >
                    ⚙️ Cài đặt tài khoản
                  </button>
                  <button
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className="btn-login"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>
              <button
                className="btn-register"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;