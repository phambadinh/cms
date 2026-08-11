import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/blog.css";
import {
  Newspaper,
  CalendarDays,
  Tag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getFeaturedBlogPosts, getPublicBlogPostsPage } from "../services/blogApi";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadBlogPosts() {
      try {
        setLoading(true);
        setError("");

        const [postsResponse, featuredResponse] = await Promise.all([
          getPublicBlogPostsPage(currentPage, 6),
          getFeaturedBlogPosts(),
        ]);

        if (!isMounted) {
          return;
        }

        setPosts(Array.isArray(postsResponse.data?.content) ? postsResponse.data.content : []);
        setTotalPages(Number(postsResponse.data?.totalPages || 0));

        const featuredItems = Array.isArray(featuredResponse.data) ? featuredResponse.data : [];
        setFeaturedPost(featuredItems[0] || null);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError("Không tải được bài viết blog. Vui lòng thử lại sau.");
        setPosts([]);
        setFeaturedPost(null);
        setTotalPages(0);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBlogPosts();

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const displayPosts = useMemo(() => {
    return posts.filter((post) => !post.featured || post.id !== featuredPost?.id);
  }, [posts, featuredPost]);

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("vi-VN").format(parsed);
  };

  const fallbackFeatured = featuredPost || posts[0] || null;

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.max(totalPages - 1, 0)));
  };

  return (
    <div className="blog-page">
      <Header />

      <section className="blog-hero">
        <div className="blog-hero-content">
          <div className="blog-hero-icon">
            <Newspaper size={30} />
          </div>
          <h1 className="blog-hero-title">Blog CMS Learning</h1>
          <p className="blog-hero-subtitle">
            Cập nhật tin tức, chia sẻ kiến thức và kinh nghiệm về học tập trực tuyến,
            CMS, công nghệ và giáo dục số.
          </p>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-container">
          <div className="blog-featured">
            <div className="blog-featured-content">
              <span className="blog-featured-tag">Featured</span>
              <h2>Bài viết nổi bật</h2>
              {loading ? (
                <p>Đang tải bài viết...</p>
              ) : error ? (
                <p>{error}</p>
              ) : fallbackFeatured ? (
                <>
                  <h3 className="blog-featured-post-title">{fallbackFeatured.title}</h3>
                  <p>{fallbackFeatured.excerpt}</p>
                  <div className="blog-featured-meta">
                    <span>{fallbackFeatured.authorName || "Biên tập viên"}</span>
                    <span>{formatDate(fallbackFeatured.date)}</span>
                  </div>
                  <Link to={`/blog/${fallbackFeatured.slug}`} className="blog-readmore">
                    Đọc thêm <ArrowRight size={18} />
                  </Link>
                </>
              ) : (
                <p>Chưa có bài viết nào để hiển thị.</p>
              )}
            </div>
          </div>

          <div className="blog-post-grid">
            {displayPosts.map((post) => (
              <article className="blog-post-card" key={post.id || post.slug}>
                <div className="blog-post-cover">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} />
                  ) : (
                    <div className="blog-post-cover-placeholder">CMS Blog</div>
                  )}
                </div>

                <div className="blog-post-meta">
                  <span className="blog-post-tag">
                    <Tag size={14} />
                    {post.tag}
                  </span>
                  <span className="blog-post-date">
                    <CalendarDays size={14} />
                    {formatDate(post.date)}
                  </span>
                </div>

                <h3 className="blog-post-title">{post.title}</h3>
                <div className="blog-post-author">Tác giả: {post.authorName || "Biên tập viên"}</div>
                <p className="blog-post-excerpt">{post.excerpt}</p>

                <Link to={`/blog/${post.slug}`} className="blog-post-link">
                  Xem chi tiết <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>

          <div className="blog-pagination">
            <button
              type="button"
              className="blog-pagination-button"
              onClick={goToPreviousPage}
              disabled={loading || currentPage === 0}
            >
              <ChevronLeft size={16} /> Trang trước
            </button>

            <span className="blog-pagination-status">
              Trang {totalPages === 0 ? 0 : currentPage + 1} / {totalPages || 0}
            </span>

            <button
              type="button"
              className="blog-pagination-button"
              onClick={goToNextPage}
              disabled={loading || currentPage >= totalPages - 1}
            >
              Trang sau <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Blog;