import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/blog.css";
import { Newspaper, CalendarDays, Tag, ArrowRight } from "lucide-react";

function Blog() {
  const posts = [
    {
      title: "Xu hướng học tập trực tuyến năm 2026",
      date: "03/08/2026",
      tag: "Education",
      excerpt:
        "Khám phá các xu hướng học online, hệ thống quản lý học tập và cách cá nhân hóa trải nghiệm người học.",
    },
    {
      title: "Cách xây dựng CMS học tập hiệu quả",
      date: "28/07/2026",
      tag: "CMS",
      excerpt:
        "Những nguyên tắc quan trọng khi thiết kế hệ thống quản lý nội dung cho giáo dục và đào tạo.",
    },
    {
      title: "Tối ưu trải nghiệm người dùng trong LMS",
      date: "21/07/2026",
      tag: "UX/UI",
      excerpt:
        "Các kỹ thuật giúp sinh viên và giảng viên thao tác nhanh, rõ ràng và thuận tiện hơn trên nền tảng số.",
    },
  ];

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
              <p>
                Tìm hiểu các ý tưởng mới nhất về nền tảng học tập, quản trị nội dung và
                cách tạo trải nghiệm học hiệu quả hơn cho người dùng.
              </p>
              <a href="/blog/latest" className="blog-readmore">
                Đọc thêm <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div className="blog-post-grid">
            {posts.map((post, index) => (
              <article className="blog-post-card" key={index}>
                <div className="blog-post-meta">
                  <span className="blog-post-tag">
                    <Tag size={14} />
                    {post.tag}
                  </span>
                  <span className="blog-post-date">
                    <CalendarDays size={14} />
                    {post.date}
                  </span>
                </div>

                <h3 className="blog-post-title">{post.title}</h3>
                <p className="blog-post-excerpt">{post.excerpt}</p>

                <a href={`/blog/${index+1}`} className="blog-post-link">
                  Xem chi tiết <ArrowRight size={16} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Blog;