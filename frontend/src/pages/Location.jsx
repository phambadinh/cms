import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/location.css";
import { MapPin, Building2, Globe } from "lucide-react";

function Location() {
  return (
    <div className="location-page">
      <Header />

      <section className="location-hero">
        <div className="location-hero-content">
          <h1 className="location-hero-title">Vị Trí</h1>
          <p className="location-hero-subtitle">
            Chúng tôi đặt trụ sở tại trung tâm TP. Hồ Chí Minh, thuận tiện cho việc phát triển và hỗ trợ người dùng.
          </p>
        </div>
      </section>

      <section className="location-section">
        <div className="location-container">
          <div className="location-card">
            <div className="location-icon"><MapPin size={24} /></div>
            <h3>Địa chỉ</h3>
            <p>Ho Chi Minh City, Vietnam</p>
          </div>

          <div className="location-card">
            <div className="location-icon"><Building2 size={24} /></div>
            <h3>Trụ sở</h3>
            <p>Trung tâm điều hành và phát triển sản phẩm CMS Learning.</p>
          </div>

          <div className="location-card">
            <div className="location-icon"><Globe size={24} /></div>
            <h3>Phạm vi hoạt động</h3>
            <p>Hỗ trợ học viên và đối tác trên toàn quốc.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Location;