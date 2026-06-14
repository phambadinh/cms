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

      {/* Hero Section */}
      <section className="hero-section">
        {/* ... giữ nguyên hero content như bạn đã viết ... */}
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