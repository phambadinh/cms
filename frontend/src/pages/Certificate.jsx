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
        <h1>My Certificates</h1>

        <p>
          View, manage, and download the
          certificates you have earned from your
          completed courses.
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
            No certificates yet
          </h3>

          <p>
            Complete eligible courses to unlock
            and download your certificates.
          </p>
        </div>
      ) : (
        <>
          {/* ================= TITLE ================= */}

          <div className="section-title">
            Earned Certificates
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
                    This certificate recognizes
                    your successful completion of
                    the course requirements.
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
                      Download
                    </button>

                    <button
                      className="certificate-btn secondary"
                      onClick={() =>
                        navigate(
                          `/learning/${item.courseId}`
                        )
                      }
                    >
                      View Course
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
                Achievement Tip
              </h3>

              <p>
                Verified certificates are easier
                to share on your CV, portfolio,
                and professional profiles.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Certificate;