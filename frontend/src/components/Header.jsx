import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { getAuthUser, authLogout } from "../services/api";
import LoginModal from "../pages/LoginModal";
import {
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  House,
  BookOpen,
  Info,
  Phone,
  LayoutDashboard,
  GraduationCap,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import "../styles/header.css";

function Header() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
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
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    authLogout();
    setIsProfileMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsProfileMenuOpen(false);
  };

  const navItems = [
    { label: "Trang chủ", path: "/", icon: House },
    { label: "Khóa học", path: "/courses", icon: BookOpen },
    { label: "Giới thiệu", path: "/about", icon: Info },
    { label: "Liên hệ", path: "/contact", icon: Phone },
  ];

  const quickLinks = useMemo(() => {
    if (!user?.role) return [];

    if (user.role === "ADMIN") {
      return [
        { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Quản lý khóa học", path: "/admin/courses", icon: GraduationCap },
        { label: "Cài đặt tài khoản", path: "/settings", icon: Settings },
      ];
    }

    if (user.role === "MENTOR") {
      return [
        { label: "Dashboard", path: "/dashboard/mentor", icon: LayoutDashboard },
        { label: "Khóa học của tôi", path: "/dashboard/mentor", icon: GraduationCap },
        { label: "Cài đặt tài khoản", path: "/settings", icon: Settings },
      ];
    }

    return [
      { label: "Dashboard", path: "/dashboard/student", icon: LayoutDashboard },
      { label: "Khóa học của tôi", path: "/my-learning", icon: GraduationCap },
      { label: "Chứng chỉ", path: "/certificates", icon: BadgeCheck, featured: true },
      { label: "Cài đặt tài khoản", path: "/settings", icon: Settings },
    ];
  }, [user]);

  return (
    <>
      <header className="app-header-shell">
        <div className="app-header-bar">
          <button
            type="button"
            className="app-brand-button"
            onClick={() => navigate("/")}
            aria-label="Về trang chủ"
          >
            <span className="app-brand-mark">CMS</span>
          </button>

          <nav className="app-main-nav" aria-label="Điều hướng chính">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.path} to={item.path} className="app-main-nav-link">
                  <Icon size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <form className="app-header-searchbox" onSubmit={handleSearch}>
            <Search
              size={16}
              className="app-header-search-icon"
              strokeWidth={2}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="app-header-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="app-header-account">
            {user ? (
              <div className="app-account-menu" ref={dropdownRef}>
                <button
                  type="button"
                  className="app-account-trigger"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  aria-label="Mở menu tài khoản"
                  aria-expanded={isProfileMenuOpen}
                >
                  <div className="app-account-avatar">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="app-account-text">
                    <span className="app-account-name">{user.username}</span>
                    <span className="app-account-role">{user.role || "Student"}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className={`app-account-chevron ${isProfileMenuOpen ? "is-open" : ""}`}
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className="app-account-dropdown">
                    <div className="app-account-dropdown-head">
                      <div className="app-account-dropdown-avatar">
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="app-account-dropdown-info">
                        <p className="app-account-dropdown-name">{user.username}</p>
                        <p className="app-account-dropdown-role">{user.role || "Student"}</p>
                      </div>
                    </div>

                    <div className="app-account-dropdown-divider" />

                    <button
                      type="button"
                      className="app-account-item"
                      onClick={() => handleNavigate("/profile")}
                    >
                      <User size={16} strokeWidth={2} />
                      <span>Hồ sơ cá nhân</span>
                    </button>

                    {quickLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          className={`app-account-item ${item.featured ? "app-account-item-featured" : ""}`}
                          onClick={() => handleNavigate(item.path)}
                        >
                          <Icon size={16} strokeWidth={2} />
                          <span>{item.label}</span>
                          {item.featured && (
                            <span className="app-account-badge">
                              <Sparkles size={12} strokeWidth={2} />
                              Nổi bật
                            </span>
                          )}
                        </button>
                      );
                    })}

                    <div className="app-account-dropdown-divider" />

                    <button
                      type="button"
                      className="app-account-item app-account-item-danger"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} strokeWidth={2} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="app-auth-actions">
                <button
                  type="button"
                  className="app-auth-login"
                  onClick={() => setIsLoginOpen(true)}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  className="app-auth-register"
                  onClick={() => navigate("/register")}
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </>
  );
}

export default Header;