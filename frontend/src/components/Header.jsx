import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUser, authLogout } from "../services/api";
import {
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Info,
  Phone,
} from "lucide-react";
import "../styles/header.css";

function Header() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const user = getAuthUser();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleNavClick = (path) => navigate(path);

  const navItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Khóa học", path: "/courses" },
    { label: "Giới thiệu", path: "/about" },
    { label: "Liên hệ", path: "/contact" },
  ];

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo */}
        <div className="header-logo" onClick={() => handleNavClick("/")} style={{ cursor: "pointer" }}>
          <span className="logo-title">CMS</span>
        </div>

        {/* Nav */}
        <nav className="header-nav">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="nav-link"
              onClick={(e) => { e.preventDefault(); handleNavClick(item.path); }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Search */}
        <form className="header-search" onSubmit={handleSearch}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Profile / Auth */}
        <div className="header-profile">
          {user ? (
            <div className="profile-menu" ref={dropdownRef}>
              <button
                className="profile-button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                aria-label="Mở menu tài khoản"
              >
                <div className="profile-avatar">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="profile-username">{user.username}</span>
                <ChevronDown
                  size={14}
                  className={`chevron-icon ${isProfileMenuOpen ? "chevron-open" : ""}`}
                />
              </button>

              {isProfileMenuOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="dropdown-info">
                      <p className="dropdown-name">{user.username}</p>
                      <p className="dropdown-role">{user.role || "Student"}</p>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <button
                    className="dropdown-item"
                    onClick={() => { navigate("/profile"); setIsProfileMenuOpen(false); }}
                  >
                    <User size={16} />
                    Hồ sơ cá nhân
                  </button>

                  <button
                    className="dropdown-item"
                    onClick={() => { navigate("/settings"); setIsProfileMenuOpen(false); }}
                  >
                    <Settings size={16} />
                    Cài đặt tài khoản
                  </button>

                  <div className="dropdown-divider" />

                  <button className="dropdown-item dropdown-item--danger" onClick={handleLogout}>
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-login" onClick={() => navigate("/login")}>
                Đăng nhập
              </button>
              <button className="btn-register" onClick={() => navigate("/register")}>
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