import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/contact.css";
import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  Send,
  MessageCircle,
} from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ lại trong 24 giờ.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setMessage("Gửi tin nhắn thất bại. Vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <Header />

      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Liên Hệ Với Chúng Tôi</h1>
          <p className="contact-hero-subtitle">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7
          </p>
        </div>
      </section>

      <section className="contact-info-section">
        <div className="contact-container">
          <h2>Thông Tin Liên Hệ</h2>
          <div className="contact-info-grid">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <MapPin size={24} />
              </div>
              <h4>Địa Chỉ</h4>
              <p>Số 70 Tô Ký</p>
              <p>Phường Trung Mỹ Tây, TP. HCM</p>
              <p>Việt Nam</p>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Phone size={24} />
              </div>
              <h4>Điện Thoại</h4>
              <p>
                <a href="tel:+84876578996">+84 876.578.996</a>
              </p>
              <p>Hotline: 1900 2005</p>
              <p>Giờ làm việc: 8:00 - 17:00</p>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Mail size={24} />
              </div>
              <h4>Email</h4>
              <p>
                <a href="mailto:info@cms.com">info@cms.com</a>
              </p>
              <p>
                <a href="mailto:support@cms.com">support@cms.com</a>
              </p>
              <p>
                <a href="mailto:contact@cms.com">contact@cms.com</a>
              </p>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Clock3 size={24} />
              </div>
              <h4>Giờ Làm Việc</h4>
              <p>Thứ 2 - Thứ 6: 08:00 - 17:00</p>
              <p>Thứ 7: 09:00 - 12:00</p>
              <p>Chủ nhật: Đóng cửa</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="contact-container">
         <h2 className="section-title">
  Gửi Tin Nhắn Cho Chúng Tôi
</h2>

<p className="section-subtitle">
  Có câu hỏi hoặc cần hỗ trợ? Hãy để lại thông tin,
  đội ngũ CMS sẽ phản hồi trong thời gian sớm nhất.
</p>
          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Họ và Tên *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Số Điện Thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Chủ Đề *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn chủ đề --</option>
                    <option value="inquiry">Yêu cầu thông tin</option>
                    <option value="support">Hỗ trợ kỹ thuật</option>
                    <option value="partnership">Hợp tác kinh doanh</option>
                    <option value="feedback">Phản hồi & Đánh giá</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Nội Dung Tin Nhắn *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                  rows="6"
                  required
                />
              </div>

              {message && (
                <div className={`form-message ${message.includes("thành công") ? "success" : "error"}`}>
                  {message}
                </div>
              )}

              <button type="submit" className="submit-button" disabled={sending}>
                {sending ? "Đang gửi..." : (
                  <>
                    <Send size={18} />
                    Gửi Tin Nhắn
                  </>
                )}
              </button>
            </form>

            <div className="contact-form-image">
  <div className="support-card">
    <div className="support-icon">
      <MessageCircle size={60} />
    </div>

    <h3>Hỗ Trợ Nhanh Chóng</h3>

    <p className="support-desc">
      Đội ngũ CMS luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn.
    </p>

    <div className="support-features">
      <div className="feature-item">
        ✅ Phản hồi trong vòng 24 giờ
      </div>

      <div className="feature-item">
  <span>🎓</span>
  <span>Hơn 100+ khóa học chất lượng</span>
</div>

      <div className="feature-item">
        👨‍🏫 50+ giảng viên giàu kinh nghiệm
      </div>

      <div className="feature-item">
        🌍 Học tập mọi lúc mọi nơi
      </div>
    </div>
  </div>
</div>
          </div>
        </div>
      </section>

      <section className="contact-map-section">
        <h2 className="section-title">
  Vị Trí Của Chúng Tôi
</h2>

<p className="section-subtitle">
  Ghé thăm văn phòng CMS hoặc liên hệ với chúng tôi bất cứ lúc nào.
</p>
        <div className="map-wrapper">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4224.596584267842!2d106.62404651092757!3d10.852087089256663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752a2723f249bd%3A0x2d3c522387507a31!2zNzAgxJAuIFTDtCBLw70sIFRydW5nIE3hu7kgVMOieSwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e1!3m2!1svi!2s!4v1781277832436!5m2!1svi!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;