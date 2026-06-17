import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import {
getPublicCourses,
enrollCourse,
getAuthUser,
} from "../services/api";

import CourseCard from "../components/course/CourseCard";

import "../styles/layout.css";
import "../styles/courses.css";

function Courses() {
const [courses, setCourses] = useState([]);
const [filteredCourses, setFilteredCourses] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [enrolling, setEnrolling] = useState({});

const navigate = useNavigate();
const user = getAuthUser();

useEffect(() => {
const fetchCourses = async () => {
setLoading(true);
setError("");


  try {
    const res = await getPublicCourses();

    const data = res.data || [];

    setCourses(data);
    setFilteredCourses(data);
  } catch (err) {
    console.error("Error fetching courses:", err);
    setError(
      "Không thể tải danh sách khóa học. Vui lòng thử lại."
    );
  } finally {
    setLoading(false);
  }
};

fetchCourses();


},
[]),

useEffect(() => {
const filtered = courses.filter((course) =>
(course.name || "")
.toLowerCase()
.includes(searchTerm.toLowerCase())
);


setFilteredCourses(filtered);


}, [searchTerm, courses]);

const handleViewCourse = (courseId) => {
navigate(`/courses/${courseId}`);
};

const handleEnroll = async (courseId) => {
if (!user) {
navigate("/login");
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
  console.error(err);

  const errorMessage =
    err.response?.data?.message ||
    "Ghi danh thất bại. Vui lòng thử lại.";

  alert(errorMessage);
} finally {
  setEnrolling((prev) => ({
    ...prev,
    [courseId]: false,
  }));
}

};

return ( <div className="layout"> <div className="layout-body"> <main className="layout-main">

      <section className="courses-hero">
        <h1>Khóa Học Lập Trình</h1>
        <p>
          Chọn từ các khóa học chất lượng cao
        </p>
      </section>

      <section className="courses-filter">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
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

      {!loading && (
        <div className="courses-grid">
          {filteredCourses.map(
            (course, index) => (
              <CourseCard
                key={
                  course.id ||
                  course._id ||
                  index
                }
                course={course}
                onView={handleViewCourse}
                onEnroll={handleEnroll}
                loading={
                  enrolling[
                    course.id ||
                      course._id
                  ]
                }
              />
            )
          )}
        </div>
      )}

      {!loading &&
        filteredCourses.length === 0 && (
          <div className="empty-state">
            Chưa có khóa học nào.
          </div>
        )}

    </main>
  </div>
</div>


);
}

export default Courses;
