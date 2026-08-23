import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  getPublicCourses,
  enrollCourse,
  getAuthUser,
} from "../services/api";
import CourseCard from "../components/course/CourseCard";
import "../styles/courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [enrolling, setEnrolling] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getPublicCourses();
        const data = res.data || [];

        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Không thể tải danh sách khóa học. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      setFilteredCourses(courses);
      return;
    }

    setFilteredCourses(
      courses.filter((course) =>
        [course.name, course.code, course.category, course.level]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      )
    );
  }, [searchTerm, courses]);

  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleEnroll = async (courseId) => {
    const user = getAuthUser();

    if (!user) {
      navigate("/login", {
        state: { from: `/courses/${courseId}` },
      });
      return;
    }

    setEnrolling((prev) => ({
      ...prev,
      [courseId]: true,
    }));

    try {
      await enrollCourse(courseId);

      alert("Ghi danh khóa học thành công!");
      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error("Error enrolling course:", err);

      alert(
        err.response?.data?.message ||
          "Ghi danh thất bại. Vui lòng thử lại."
      );
    } finally {
      setEnrolling((prev) => ({
        ...prev,
        [courseId]: false,
      }));
    }
  };

  return (
    <div className="courses-page">
      <Header />

      <main>
        <section className="courses-hero">
          <h1>Khóa Học Lập Trình</h1>
          <p>
            Chọn từ các khóa học chất lượng cao để phát triển kỹ năng của bạn.
          </p>
        </section>

        <section
          className="courses-filter"
          aria-label="Tìm kiếm khóa học"
        >
          <div className="search-box">
            <Search size={18} aria-hidden="true" />

            <input
              type="search"
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Tìm kiếm khóa học"
            />
          </div>
        </section>

        {loading && (
          <p className="loading-text">
            Đang tải khóa học...
          </p>
        )}

        {error && (
          <p className="courses-error">
            {error}
          </p>
        )}

        {!loading && !error && filteredCourses.length > 0 && (
          <section
            className="courses-grid"
            aria-label="Danh sách khóa học"
          >
            {filteredCourses.map((course, index) => {
              const courseId = course.id || course._id;

              return (
                <CourseCard
                  key={courseId || index}
                  course={course}
                  onView={handleViewCourse}
                  onEnroll={handleEnroll}
                  loading={Boolean(enrolling[courseId])}
                />
              );
            })}
          </section>
        )}

        {!loading && !error && filteredCourses.length === 0 && (
          <div className="empty-state">
            {searchTerm
              ? "Không tìm thấy khóa học phù hợp."
              : "Chưa có khóa học nào."}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Courses;