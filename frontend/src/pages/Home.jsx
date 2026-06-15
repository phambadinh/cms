import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicCourses, getAuthUser } from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CourseCard from "../components/course/CourseCard";
import "../styles/home.css";

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = getAuthUser();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getPublicCourses();
        setCourses((res.data || []).slice(0, 6));
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Không thể tải danh sách khóa học.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleExplore = () => {
    navigate("/courses");
  };

  const handleRegister = () => {
    if (user) {
      navigate("/courses");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="home-page">
      <Header />

     <section className="hero-section">
  <div className="hero-content">

    <div className="hero-badge">
      ⭐ NỀN TẢNG HỌC TRỰC TUYẾN HÀNG ĐẦU
    </div>

    <h1 className="hero-title">
      Học tập không giới hạn,
      <br />
      phát triển tương lai của bạn
    </h1>

    <p className="hero-subtitle">
      Khám phá hàng trăm khóa học chất lượng cao từ các giảng viên hàng đầu.
      Học mọi lúc, mọi nơi với nền tảng E-Learning hiện đại.
    </p>

    <div className="hero-stats">
      <div className="stat-item">
        <span className="stat-number">100+</span>
        <span className="stat-label">Khóa học</span>
      </div>

      <div className="stat-item">
        <span className="stat-number">1000+</span>
        <span className="stat-label">Học viên</span>
      </div>

      <div className="stat-item">
        <span className="stat-number">50+</span>
        <span className="stat-label">Giảng viên</span>
      </div>
    </div>

    <div className="hero-buttons">
      <button
        className="btn btn-primary"
        onClick={handleExplore}
      >
        Khám phá khóa học
      </button>

      <button
        className="btn btn-secondary"
        onClick={handleRegister}
      >
        Bắt đầu ngay
      </button>
    </div>

    <div className="hero-features">
      <span>✓ Học mọi lúc mọi nơi</span>
      <span>✓ Chứng chỉ uy tín</span>
      <span>✓ Hỗ trợ 24/7</span>
    </div>

  </div>

  <div className="hero-image">
    <div className="hero-image-placeholder">

      <div className="floating-card top-card">
        🏆 Nền tảng uy tín
      </div>

      <img
        src="https://cdn-icons-png.flaticon.com/512/1055/1055687.png"
        alt="E-Learning"
        className="hero-illustration"
      />

      <div className="floating-card bottom-card">
        👥 Cộng đồng học tập
      </div>

    </div>
  </div>
</section>

      {/* Featured Courses Section */}
      <section className="featured-courses">
        <h2 className="section-title">Danh mục phổ biến</h2>
        <p className="section-subtitle">Chọn lĩnh vực bạn muốn theo dõi</p>

        {loading && <p className="loading">Đang tải khóa học...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && courses.length > 0 && (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard
                key={course.id || course._id}
                course={course}
                onClick={() =>
                  navigate(`/courses/${course.id || course._id}`)
                }
              />
            ))}
          </div>
        )}

        {!loading && courses.length === 0 && (
          <p className="no-courses">Không có khóa học nào.</p>
        )}

        <div className="view-all-button">
          <button className="btn btn-outline" onClick={handleExplore}>
            Xem tất cả khóa học
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;