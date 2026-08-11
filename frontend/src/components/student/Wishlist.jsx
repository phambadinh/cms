import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  HeartOff,
  BookOpen,
  Star,
  Search,
  ArrowRight,
} from "lucide-react";
import { getMyWishlist, toggleWishlist } from "../../services/api";
import "../../styles/wishlist.css";

function Wishlist() {
  const [items, setItems] = useState([]);
  const [removingId, setRemovingId] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await getMyWishlist();
      setItems(res.data || []);
    } catch (err) {
      console.error("Không tải được danh sách yêu thích:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const total = items.length;
  const freeCourses = items.filter((c) => c.courseType === "FREE").length;
  const premiumCourses = items.filter((c) => c.courseType === "PREMIUM").length;

  const handleRemove = async (courseId) => {
    try {
      setRemovingId(courseId);
      await toggleWishlist(courseId);
      await loadWishlist();
    } catch (err) {
      console.error("Không xóa được khỏi wishlist:", err);
    } finally {
      setRemovingId("");
    }
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-hero">
        <h1>
          <Heart size={30} style={{ marginRight: 10 }} />
          Danh sách yêu thích
        </h1>
        <p>
          Lưu lại những khóa học bạn quan tâm để dễ dàng quay lại và ghi danh
          khi sẵn sàng.
        </p>
      </div>

      <div className="wishlist-stats">
        <div className="wishlist-stat-card">
          <div className="wishlist-stat-icon">
            <Heart size={24} />
          </div>
          <h3>Tổng khóa yêu thích</h3>
          <div className="value">{total}</div>
        </div>

        <div className="wishlist-stat-card">
          <div className="wishlist-stat-icon">
            <BookOpen size={24} />
          </div>
          <h3>Khóa miễn phí</h3>
          <div className="value">{freeCourses}</div>
        </div>

        <div className="wishlist-stat-card">
          <div className="wishlist-stat-icon">
            <Star size={24} />
          </div>
          <h3>Khóa trả phí</h3>
          <div className="value">{premiumCourses}</div>
        </div>
      </div>

      {loading ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">
            <Search size={34} />
          </div>
          <h2>Đang tải danh sách yêu thích...</h2>
        </div>
      ) : items.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">
            <HeartOff size={34} />
          </div>
          <h2>Chưa có khóa học nào trong danh sách yêu thích</h2>
          <p>
            Hãy khám phá các khóa học hấp dẫn và thêm vào danh sách yêu thích
            để lưu lại những khóa bạn muốn học sau.
          </p>
          <div className="wishlist-actions">
            <button
              className="wishlist-btn primary"
              type="button"
              onClick={() => navigate("/courses")}
            >
              <Search size={18} />
              Khám phá khóa học
            </button>
            <button
              className="wishlist-btn secondary"
              type="button"
              onClick={() => navigate("/my-learning")}
            >
              <BookOpen size={18} />
              Khóa học của tôi
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="section-title" style={{ marginBottom: 18 }}>
            <Heart size={24} />
            <span>Khóa học đã lưu</span>
          </div>

          <div className="my-courses-grid">
            {items.map((course) => (
              <div key={course.id} className="my-course-card">
                <div className="course-banner">
                  <BookOpen size={52} />
                </div>

                <div className="my-course-card-content">
                  <div className="course-status wishlist-tag">
                    {course.courseType === "FREE" ? "Miễn phí" : "Trả phí"}
                  </div>

                  <h3>{course.name || "Khóa học"}</h3>
                  <div className="course-level">
                    {course.level || "Tất cả trình độ"}
                  </div>

                  <p>
                    {course.shortDescription ||
                      "Khóa học phù hợp để bạn bắt đầu hoặc nâng cao kiến thức."}
                  </p>

                  <div className="course-progress-label">
                    <span>Số bài học</span>
                    <span>{course.totalLessons ?? 0}</span>
                  </div>

                  <div className="wishlist-card-actions">
                    <button
                      className="continue-btn"
                      type="button"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <span>Xem chi tiết</span>
                      <ArrowRight size={18} />
                    </button>

                    <button
                      className="wishlist-remove-btn"
                      type="button"
                      onClick={() => handleRemove(course.id)}
                      disabled={removingId === course.id}
                    >
                      <HeartOff size={16} />
                      <span>
                        {removingId === course.id
                          ? "Đang xóa..."
                          : "Bỏ khỏi yêu thích"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Wishlist;