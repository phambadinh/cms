import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicCourses, getAuthUser } from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CourseCard from "../components/course/CourseCard";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  MonitorPlay,
  ShieldCheck,
  Users,
} from "lucide-react";
import "../styles/home.css";

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const user = getAuthUser();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getPublicCourses();

      console.log("COURSES API:", res.data);

      const sortedCourses = [...(res.data || [])].sort((a, b) => {
        if (a.courseType === "FREE" && b.courseType !== "FREE") return -1;
        if (a.courseType !== "FREE" && b.courseType === "FREE") return 1;
        return 0;
      });

      setCourses(sortedCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);

      setError(
        err?.response?.data?.message ||
          "Không thể tải danh sách khóa học."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Courses State:", courses);
  }, [courses]);

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

  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleEnrollCourse = (courseId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="home-page">
      <Header />

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Khám phá thế giới tri thức cùng CMS Learning
          </h1>

          <p className="hero-subtitle">
            Mở rộng kỹ năng, chinh phục công nghệ và xây dựng tương lai nghề
            nghiệp với các khóa học trực tuyến chất lượng, dễ học và thực tế.
          </p>

          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={handleExplore}
            >
              <BookOpen
                size={18}
                style={{ marginRight: 8 }}
              />
              Khám phá khóa học
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleRegister}
            >
              <GraduationCap
                size={18}
                style={{ marginRight: 8 }}
              />
              {user ? "Tiếp tục học" : "Đăng ký ngay"}
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <BookOpen size={20} />
              <div className="stat-number">30+</div>
              <div className="stat-label">
                Khóa học nổi bật
              </div>
            </div>

            <div className="stat-item">
              <Users size={20} />
              <div className="stat-number">50K+</div>
              <div className="stat-label">
                Học viên tin tưởng
              </div>
            </div>

            <div className="stat-item">
              <ShieldCheck size={20} />
              <div className="stat-number">98%</div>
              <div className="stat-label">
                Hài lòng sau khóa học
              </div>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-image-placeholder">
            <MonitorPlay
              className="computer-icon"
              strokeWidth={1.8}
            />
          </div>
        </div>
      </section>

      <section className="featured-courses">
        <h2 className="section-title">
          Danh mục phổ biến
        </h2>

        <p className="section-subtitle">
          Chọn lĩnh vực bạn muốn theo dõi
        </p>

        {loading && (
          <p className="loading">
            Đang tải khóa học...
          </p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {!loading && courses.length > 0 && (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard
                key={course.id || course._id}
                course={course}
                onView={handleViewCourse}
                onEnroll={handleEnrollCourse}
                loading={false}
              />
            ))}
          </div>
        )}

        {!loading &&
          !error &&
          courses.length === 0 && (
            <p className="no-courses">
              Không có khóa học nào.
            </p>
          )}

        <div className="view-all-button">
          <button
            className="btn btn-outline"
            onClick={handleExplore}
          >
            Xem tất cả khóa học

            <ArrowRight
              size={18}
              style={{ marginLeft: 8 }}
            />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;