import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/blog.css";
import { CalendarDays, ArrowLeft, Tag } from "lucide-react";
import { getBlogPostBySlug } from "../services/blogApi";

function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPost() {
      try {
        setLoading(true);
        setError("");

        const response = await getBlogPostBySlug(slug);
        if (isMounted) {
          setPost(response.data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError("Không tìm thấy bài viết hoặc bài viết chưa được công bố.");
          setPost(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadPost();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

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

  return (
    <div className="blog-page">
      <Header />

      <section className="blog-detail-hero">
        <div className="blog-container blog-detail-container">
          <Link to="/blog" className="blog-back-link">
            <ArrowLeft size={16} /> Quay lại blog
          </Link>

          {loading ? (
            <p>Đang tải bài viết...</p>
          ) : error ? (
            <p className="blog-detail-error">{error}</p>
          ) : post ? (
            <article className="blog-detail-card">
              {post.coverImage ? (
                <div className="blog-detail-cover">
                  <img src={post.coverImage} alt={post.title} />
                </div>
              ) : null}

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

              <h1 className="blog-detail-title">{post.title}</h1>
              <div className="blog-detail-author">Tác giả: {post.authorName || "Biên tập viên"}</div>
              <p className="blog-detail-excerpt">{post.excerpt}</p>

              <div className="blog-detail-content">
                {post.content ? post.content : post.excerpt}
              </div>
            </article>
          ) : (
            <p className="blog-detail-error">Không có dữ liệu bài viết.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default BlogDetail;