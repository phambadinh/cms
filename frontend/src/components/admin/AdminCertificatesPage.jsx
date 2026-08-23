import { useEffect, useState } from "react";
import {
  getAllCourses,
  getUsersByRole,
  getCertificatesByCourse,
  issueCertificate,
  revokeCertificate,
  getViewableCertificate,
  verifyCertificate,
} from "../../services/api";
import { RefreshCw, Eye, ShieldOff, ShieldCheck, Award } from "lucide-react";

// Khớp đúng CertificateResponse.java thật:
// id, userId, userName, fullName, courseId, courseName, certificateCode,
// certificateUrl, verified, revoked, issuedByUserId, issuedByUsername,
// issuedByFullName, issuedByRole, revokedByUserId, revokeReason,
// issueDate, verifiedAt, revokedAt (LocalDateTime -> chuỗi ISO từ backend)
//
// Endpoint thật (CertificateController.java):
//   POST /certificates/issue?courseId=&userId=            (MENTOR/ADMIN cấp hộ)
//   POST /certificates/{certificateId}/revoke?reason=      (reason optional)

function formatDate(value) {
  if (!value) return "N/A";
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleString("vi-VN");
}

function AdminCertificatesPage() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    getAllCourses()
      .then((res) => setCourses(res.data || []))
      .catch(() => setError("Không thể tải danh sách khóa học"));

    getUsersByRole("STUDENT")
      .then((res) => setStudents(res.data || []))
      .catch(() => setError("Không thể tải danh sách học viên"));
  }, []);

  const loadCertificates = async (courseId) => {
    if (!courseId) {
      setCertificates([]);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await getCertificatesByCourse(courseId);
      setCertificates(res.data || []);
    } catch {
      setError("Không thể tải chứng chỉ của khóa học này");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    loadCertificates(courseId);
  };

  const handleIssue = async () => {
    if (!selectedCourseId || !selectedStudentId) {
      setActionMessage("Chọn khóa học và học viên trước khi cấp chứng chỉ.");
      return;
    }
    try {
      setIssuing(true);
      await issueCertificate(selectedCourseId, selectedStudentId);
      setActionMessage("Đã cấp chứng chỉ thành công.");
      loadCertificates(selectedCourseId);
    } catch (err) {
      setActionMessage(
        err.response?.data?.message ||
          "Không thể cấp chứng chỉ (học viên có thể chưa hoàn thành khóa học)."
      );
    } finally {
      setIssuing(false);
    }
  };

  const handleVerify = async (certificateId) => {
    try {
      const res = await verifyCertificate(certificateId);
      setActionMessage(
        `Certificate #${certificateId}: ${res.data?.valid ? "Hợp lệ" : "Không hợp lệ"}`
      );
    } catch {
      setActionMessage(`Không thể xác minh certificate #${certificateId}`);
    }
  };

  const handleView = async (certificateId) => {
    try {
      const res = await getViewableCertificate(certificateId);
      const url = res.data?.url || res.data?.certificateUrl;
      if (url) window.open(url, "_blank", "noreferrer");
      else setActionMessage("Certificate không có URL để xem.");
    } catch {
      setActionMessage(`Không thể mở certificate #${certificateId}`);
    }
  };

  const handleRevoke = async (certificateId) => {
    const reason = window.prompt("Lý do thu hồi chứng chỉ (có thể để trống):", "");
    if (reason === null) return; // user bấm Cancel
    try {
      await revokeCertificate(certificateId, reason || undefined);
      setActionMessage(`Đã thu hồi certificate #${certificateId}`);
      loadCertificates(selectedCourseId);
    } catch (err) {
      setActionMessage(
        err.response?.data?.message || `Không thể thu hồi certificate #${certificateId}`
      );
    }
  };

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-module-title">Certificates</h1>
          <p className="admin-module-subtitle">
            Cấp chứng chỉ cho học viên và quản lý theo từng khóa học.
          </p>
        </div>

        <div className="admin-module-actions">
          <button
            type="button"
            className="admin-module-button"
            onClick={() => loadCertificates(selectedCourseId)}
          >
            <RefreshCw size={18} style={{ marginRight: 6 }} />
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="dash-error">{error}</div>}
      {actionMessage && <div className="admin-metric-note">{actionMessage}</div>}

      {/* ISSUE CERTIFICATE FORM */}
      <div className="admin-module-card">
        <h3 style={{ marginTop: 0 }}>Cấp chứng chỉ cho học viên</h3>
        <div
          className="admin-form-grid"
          style={{ gridTemplateColumns: "1fr 1fr auto", display: "grid", gap: 12, alignItems: "end" }}
        >
          <label className="admin-field">
            <span>Khóa học</span>
            <select value={selectedCourseId} onChange={handleCourseChange}>
              <option value="">-- Chọn khóa học --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span>Học viên</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              <option value="">-- Chọn học viên --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName || s.username} ({s.email})
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="admin-module-button primary"
            onClick={handleIssue}
            disabled={issuing}
          >
            <Award size={18} style={{ marginRight: 6 }} />
            {issuing ? "Đang cấp..." : "Cấp chứng chỉ"}
          </button>
        </div>
      </div>

      {/* CERTIFICATE LIST BY COURSE */}
      <div className="admin-module-card">
        <div className="admin-module-toolbar">
          <span>Danh sách chứng chỉ theo khóa học đã chọn ở trên</span>
          <span>{certificates.length} certificates</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã chứng chỉ</th>
                <th>Học viên</th>
                <th>Ngày cấp</th>
                <th>Cấp bởi</th>
                <th>Trạng thái</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!selectedCourseId ? (
                <tr>
                  <td colSpan={6}>Chọn một khóa học để xem chứng chỉ.</td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={6}>Loading...</td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan={6}>Chưa có chứng chỉ nào cho khóa học này.</td>
                </tr>
              ) : (
                certificates.map((cert) => (
                  <tr key={cert.id}>
                    <td>{cert.certificateCode}</td>
                    <td>{cert.fullName || cert.userName || cert.userId}</td>
                    <td>{formatDate(cert.issueDate)}</td>
                    <td>
                      {cert.issuedByFullName || cert.issuedByUsername || "N/A"}
                      {cert.issuedByRole ? ` (${cert.issuedByRole})` : ""}
                    </td>
                    <td>
                      <span
                        className={
                          cert.revoked ? "status-badge status-draft" : "status-badge status-live"
                        }
                        title={cert.revoked ? cert.revokeReason || "" : ""}
                      >
                        {cert.revoked ? "Revoked" : cert.verified ? "Verified" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-row-button"
                          onClick={() => handleView(cert.id)}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          className="admin-row-button"
                          onClick={() => handleVerify(cert.id)}
                        >
                          <ShieldCheck size={14} />
                        </button>
                        <button
                          type="button"
                          className="admin-row-button danger"
                          onClick={() => handleRevoke(cert.id)}
                          disabled={cert.revoked}
                        >
                          <ShieldOff size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminCertificatesPage;
