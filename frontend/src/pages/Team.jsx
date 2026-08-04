import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/team.css";
import { Briefcase, Code2, UserCog, Wrench, Users, ShieldCheck } from "lucide-react";

function Team() {
  const members = [
    {
      icon: <Briefcase size={24} />,
      name: "Nguyễn Văn A",
      role: "Giám đốc & Sáng lập viên",
      desc: "Định hướng chiến lược, phát triển sản phẩm và quản lý vận hành hệ thống.",
    },
    {
      icon: <Code2 size={24} />,
      name: "Trần Minh B",
      role: "Senior Frontend Engineer",
      desc: "Phụ trách giao diện người dùng, trải nghiệm học tập và tối ưu hiệu năng.",
    },
    {
      icon: <UserCog size={24} />,
      name: "Phạm Thị C",
      role: "Quản lý nội dung",
      desc: "Xây dựng nội dung học tập, quản trị bài giảng và chuẩn hóa học liệu.",
    },
    {
      icon: <Wrench size={24} />,
      name: "Lê Công D",
      role: "Kỹ sư phần mềm",
      desc: "Thiết kế backend, API, cơ sở dữ liệu và các luồng xử lý hệ thống.",
    },
  ];

  const values = [
    {
      icon: <Users size={24} />,
      title: "Hợp tác",
      desc: "Làm việc nhóm chặt chẽ để tạo ra sản phẩm tốt hơn cho người học.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Trách nhiệm",
      desc: "Cam kết chất lượng, bảo mật và trải nghiệm ổn định cho hệ thống.",
    },
  ];

  return (
    <div className="team-page">
      <Header />

      <section className="team-hero">
        <div className="team-hero-content">
          <h1 className="team-hero-title">Đội Ngũ Chúng Tôi</h1>
          <p className="team-hero-subtitle">
            Một tập thể đam mê công nghệ, giáo dục và sáng tạo, cùng xây dựng nền tảng CMS Learning hiệu quả hơn mỗi ngày.
          </p>
        </div>
      </section>

      <section className="team-section">
        <div className="team-container">
          <h2 className="team-section-title">Thành viên cốt lõi</h2>
          <div className="team-grid">
            {members.map((member, index) => (
              <article className="team-card" key={index}>
                <div className="team-avatar">{member.icon}</div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-desc">{member.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="team-values">
        <div className="team-container">
          <h2 className="team-section-title">Giá trị làm việc</h2>
          <div className="team-values-grid">
            {values.map((value, index) => (
              <div className="team-value-card" key={index}>
                <div className="team-value-icon">{value.icon}</div>
                <h4>{value.title}</h4>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Team;