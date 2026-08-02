// src/pages/Certificate.jsx

import { useEffect, useState } from "react";
import {
  Award,
  Download,
  BadgeCheck,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyCertificates } from "../services/api";

import "../styles/certificate.css";

function Certificate() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyCertificates();
        setCertificates(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalCertificates = certificates.length;

  const verifiedCertificates = certificates.filter(
    (item) => item.verified === true
  ).length;

  const latestYear =
    certificates.length > 0
      ? Math.max(
          ...certificates.map((item) =>
            new Date(item.issueDate).getFullYear()
          )
        )
      : "--";

  return (
    <div className="certificate-page">
      {/* ================= HEADER ================= */}

      <div className="certificate-hero">
        <h1>Chứng chỉ của tôi</h1>

        <p>
          Xem, quản lý, và tải xuống các
          chứng chỉ bạn đã đạt được từ các
          khóa học đã hoàn thành.
        </p>
      </div>

      {/* ================= STATS ================= */}

      <div className="certificate-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>

          <h3>Total Certificates</h3>

          <div className="value">
            {totalCertificates}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BadgeCheck size={24} />
          </div>

          <h3>Verified</h3>

          <div className="value">
            {verifiedCertificates}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>

          <h3>Latest Year</h3>

          <div className="value">
            {latestYear}
          </div>
        </div>
      </div>

      {/* ================= EMPTY ================= */}

      {loading ? (
        <div className="empty-certificate">
          <h3>Loading...</h3>
        </div>
      ) : certificates.length === 0 ? (
        <div className="empty-certificate">
          <Award
            size={72}
            color="#0056D2"
          />

          <h3>
            Chưa có chứng chỉ nào
          </h3>

          <p>
            Hoàn thành các khóa học đủ điều kiện để mở khóa
            và tải xuống chứng chỉ của bạn.
          </p>
        </div>
      ) : (
        <>
          {/* ================= TITLE ================= */}

          <div className="section-title">
            Chứng chỉ đã đạt được
          </div>

          {/* ================= GRID ================= */}

          <div className="certificate-grid">
            {certificates.map((item) => (
              <div
                key={item.id}
                className="certificate-card"
              >
                {/* THUMBNAIL */}

                <div className="certificate-banner">
                  <Award size={42} />
                </div>

                {/* BODY */}

                <div className="certificate-card-content">
                  <div
                    className={`certificate-status ${
                      item.verified
                        ? "verified"
                        : "pending"
                    }`}
                  >
                    {item.verified
                      ? "Verified"
                      : "Pending"}
                  </div>

                  <h3>
                    {item.courseName || "Course"}
                  </h3>

                  <div className="certificate-meta">
                    Issued on:{" "}
                    <span>
                      {item.issueDate
                        ? new Date(
                            item.issueDate
                          ).toLocaleDateString()
                        : "--"}
                    </span>
                  </div>

                  <p>
                    Đây là chứng chỉ xác nhận rằng bạn đã hoàn thành khóa học và đạt được các kỹ năng cần thiết. Hãy tự hào về thành tích của mình!
                  </p>

                  <div className="certificate-actions">
                    <button
                      className="certificate-btn primary"
                      onClick={() =>
                        window.open(
                          item.certificateUrl,
                          "_blank"
                        )
                      }
                    >
                      <Download size={18} />
                      Tải xuống
                    </button>

                    <button
                      className="certificate-btn secondary"
                      onClick={() =>
                        navigate(
                          `/learning/${item.courseId}`
                        )
                      }
                    >
                      Xem Khóa học
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= TIP ================= */}

          <div className="certificate-tip">
            <div className="certificate-tip-icon">
                <Award size={28} />
            </div>

            <div>
              <h3>
                Mẹo thành tựu
              </h3>

              <p>
                Hãy chia sẻ chứng chỉ của bạn trên các nền tảng mạng xã hội để khoe thành tích học tập và khích lệ bản thân tiếp tục học hỏi.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Certificate;