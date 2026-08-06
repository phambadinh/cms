package com.cms.service.impl;

import com.cms.dto.CertificateResponse;
import com.cms.model.Certificate;
import com.cms.model.Course;
import com.cms.model.Enrollment;
import com.cms.model.EnrollmentStatus;
import com.cms.model.User;
import com.cms.model.UserRole;
import com.cms.repository.CertificateRepository;
import com.cms.repository.EnrollmentRepository;
import com.cms.service.CertificateService;
import com.cms.service.CourseService;
import com.cms.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificateServiceImpl implements CertificateService {
    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseService courseService;
    private final UserService userService;

    public CertificateServiceImpl(
            CertificateRepository certificateRepository,
            EnrollmentRepository enrollmentRepository,
            CourseService courseService,
            UserService userService) {
        this.certificateRepository = certificateRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.courseService = courseService;
        this.userService = userService;
    }

    @Override
    public Certificate issueCertificate(String issuerUserId, String issuerRole, String targetUserId, String courseId) {
        courseService.getCourseById(courseId);
        User targetUser = userService.getUserById(targetUserId);

        if (targetUser.getRole() == null || targetUser.getRole() != UserRole.STUDENT) {
            throw new RuntimeException("Chỉ có thể cấp chứng chỉ cho student");
        }

        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(targetUserId, courseId)
                .orElseThrow(() -> new RuntimeException("Student chưa đăng ký khóa học này"));

        if (enrollment.getStatus() != EnrollmentStatus.COMPLETED
                && (enrollment.getProgressPercentage() == null || enrollment.getProgressPercentage() < 100.0)) {
            throw new RuntimeException("Chỉ có thể cấp chứng chỉ khi học viên đã hoàn thành khóa học");
        }

        Optional<Certificate> existingActive = certificateRepository.findByUserIdAndCourseId(targetUserId, courseId)
                .filter(certificate -> !certificate.isRevoked());
        if (existingActive.isPresent()) {
            return existingActive.get();
        }

        Certificate certificate = new Certificate();
        certificate.setUserId(targetUserId);
        certificate.setCourseId(courseId);
        certificate.setCertificateCode(buildCertificateCode(courseId));
        certificate.setIssuedByUserId(issuerUserId);
        certificate.setIssuedByRole(issuerRole);
        certificate.setVerified(true);
        certificate.setRevoked(false);
        certificate.setIssueDate(LocalDateTime.now());
        certificate.setVerifiedAt(LocalDateTime.now());

        return certificateRepository.save(certificate);
    }

    @Override
    public List<Certificate> getMyCertificates(String userId) {
        return certificateRepository.findByUserId(userId)
                .stream()
                .filter(certificate -> !certificate.isRevoked())
                .toList();
    }

    @Override
    public List<Certificate> getCertificatesByCourse(String courseId) {
        return certificateRepository.findByCourseId(courseId);
    }
    @SuppressWarnings("null")
    @Override
    public Optional<Certificate> getCertificateById(String certificateId) {
        return certificateRepository.findById(certificateId);
    }

    @Override
    public Optional<Certificate> getCertificateByUserAndCourse(String userId, String courseId) {
        return certificateRepository.findByUserIdAndCourseId(userId, courseId);
    }
    @SuppressWarnings("null")
    @Override
    public Certificate revokeCertificate(String certificateId, String revokedByUserId, String revokeReason) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chứng chỉ"));

        certificate.setRevoked(true);
        certificate.setVerified(false);
        certificate.setRevokedByUserId(revokedByUserId);
        certificate.setRevokeReason(revokeReason);
        certificate.setRevokedAt(LocalDateTime.now());

        return certificateRepository.save(certificate);
    }

    @Override
    public CertificateResponse toResponse(Certificate certificate) {
        Course course = courseService.getCourseById(certificate.getCourseId());
        User user = userService.getUserById(certificate.getUserId());
        User issuer = certificate.getIssuedByUserId() != null ? userService.getUserById(certificate.getIssuedByUserId()) : null;

        return new CertificateResponse(
                certificate.getId(),
                certificate.getUserId(),
                user.getUsername(),
                user.getFullName(),
                certificate.getCourseId(),
                course.getName(),
                certificate.getCertificateCode(),
          "http://localhost:8080/api/certificates/" + certificate.getId() + "/viewable",
                certificate.isVerified(),
                certificate.isRevoked(),
                certificate.getIssuedByUserId(),
                issuer != null ? issuer.getUsername() : null,
                issuer != null ? issuer.getFullName() : null,
                certificate.getIssuedByRole(),
                certificate.getRevokedByUserId(),
                certificate.getRevokeReason(),
                certificate.getIssueDate(),
                certificate.getVerifiedAt(),
                certificate.getRevokedAt()
        );
    }

    @Override
    public Map<String, Object> getVerificationStatus(Certificate certificate) {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("certificateId", certificate.getId());
        status.put("certificateCode", certificate.getCertificateCode());
        status.put("verified", certificate.isVerified() && !certificate.isRevoked());
        status.put("revoked", certificate.isRevoked());
        status.put("issueDate", certificate.getIssueDate());
        status.put("verifiedAt", certificate.getVerifiedAt());
        status.put("revokedAt", certificate.getRevokedAt());
        return status;
    }

    @Override
    public List<Map<String, Object>> getVerificationHistory(Certificate certificate) {
        List<Map<String, Object>> history = new ArrayList<>();

        history.add(buildHistoryEntry(
                "ISSUED",
                certificate.getIssueDate(),
                certificate.getIssuedByUserId(),
                certificate.getIssuedByRole(),
                "Chứng chỉ đã được cấp"
        ));

        if (certificate.isRevoked()) {
            history.add(buildHistoryEntry(
                    "REVOKED",
                    certificate.getRevokedAt(),
                    certificate.getRevokedByUserId(),
                    certificate.getIssuedByRole(),
                    certificate.getRevokeReason() != null ? certificate.getRevokeReason() : "Chứng chỉ đã bị thu hồi"
            ));
        }

        return history;
    }

    @Override
    public String buildViewableHtml(Certificate certificate) {
        Course course = courseService.getCourseById(certificate.getCourseId());
        User student = userService.getUserById(certificate.getUserId());
        User issuer = certificate.getIssuedByUserId() != null ? userService.getUserById(certificate.getIssuedByUserId()) : null;
        String issuedAt = certificate.getIssueDate() != null
                ? certificate.getIssueDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "--";

        return """
                <!doctype html>
                <html lang="vi">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Chứng chỉ %s</title>
                  <style>
                    body {
                      margin: 0;
                      min-height: 100vh;
                      display: grid;
                      place-items: center;
                      font-family: Arial, Helvetica, sans-serif;
                      background: linear-gradient(135deg, #0f172a 0%%, #1d4ed8 50%%, #60a5fa 100%%);
                      color: #0f172a;
                    }
                    .sheet {
                      width: min(920px, calc(100vw - 32px));
                      background: #fff;
                      border-radius: 28px;
                      overflow: hidden;
                      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.35);
                    }
                    .top {
                      padding: 34px 40px;
                      background: linear-gradient(135deg, #eff6ff, #dbeafe);
                      border-bottom: 1px solid #bfdbfe;
                    }
                    .brand {
                      font-size: 13px;
                      letter-spacing: 2px;
                      text-transform: uppercase;
                      color: #2563eb;
                      font-weight: 700;
                    }
                    .title {
                      margin: 12px 0 0;
                      font-size: 40px;
                      line-height: 1.1;
                    }
                    .body {
                      padding: 40px;
                    }
                    .code {
                      display: inline-block;
                      margin-bottom: 18px;
                      padding: 8px 14px;
                      border-radius: 999px;
                      background: #eff6ff;
                      color: #1d4ed8;
                      font-weight: 700;
                    }
                    .name {
                      font-size: 28px;
                      font-weight: 700;
                      margin: 10px 0 8px;
                    }
                    .course {
                      font-size: 20px;
                      color: #475569;
                      margin: 0 0 24px;
                    }
                    .grid {
                      display: grid;
                      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                      gap: 18px;
                      margin-top: 30px;
                    }
                    .card {
                      padding: 18px;
                      border-radius: 18px;
                      background: #f8fbff;
                      border: 1px solid #e2e8f0;
                    }
                    .label {
                      font-size: 12px;
                      letter-spacing: 1px;
                      text-transform: uppercase;
                      color: #64748b;
                      margin-bottom: 8px;
                    }
                    .value {
                      font-size: 16px;
                      font-weight: 700;
                      color: #0f172a;
                    }
                    .footer {
                      padding: 18px 40px 34px;
                      border-top: 1px solid #e2e8f0;
                      color: #64748b;
                      display: flex;
                      justify-content: space-between;
                      gap: 16px;
                      flex-wrap: wrap;
                    }
                  </style>
                </head>
                <body>
                  <main class="sheet">
                    <section class="top">
                      <div class="brand">Hệ thống quản lý khóa học</div>
                      <h1 class="title">Chứng chỉ hoàn thành khóa học</h1>
                    </section>
                    <section class="body">
                      <div class="code">%s</div>
                      <div class="name">%s</div>
                      <p class="course">đã hoàn thành khóa học <strong>%s</strong></p>
                      <p>Chứng chỉ này xác nhận học viên đã hoàn thành đầy đủ yêu cầu của khóa học và được cấp bởi hệ thống.</p>
                      <div class="grid">
                        <div class="card">
                          <div class="label">Mã chứng chỉ</div>
                          <div class="value">%s</div>
                        </div>
                        <div class="card">
                          <div class="label">Ngày cấp</div>
                          <div class="value">%s</div>
                        </div>
                        <div class="card">
                          <div class="label">Người cấp</div>
                          <div class="value">%s</div>
                        </div>
                      </div>
                    </section>
                    <section class="footer">
                      <span>Chứng chỉ số - xác minh công khai qua hệ thống</span>
                      <span>CMS</span>
                    </section>
                  </main>
                </body>
                </html>
                """.formatted(
                certificate.getCertificateCode(),
                student.getFullName() != null && !student.getFullName().isBlank() ? student.getFullName() : student.getUsername(),
                course.getName(),
                certificate.getCertificateCode(),
                issuedAt,
                issuer != null ? (issuer.getFullName() != null && !issuer.getFullName().isBlank() ? issuer.getFullName() : issuer.getUsername()) : "Hệ thống"
        );
    }

    private String buildCertificateCode(String courseId) {
        String coursePart = courseId.length() > 6 ? courseId.substring(0, 6).toUpperCase() : courseId.toUpperCase();
        return "CMS-" + LocalDateTime.now().getYear() + "-" + coursePart + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private Map<String, Object> buildHistoryEntry(String action, LocalDateTime at, String actorUserId, String actorRole, String message) {
        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("action", action);
        entry.put("at", at);
        entry.put("actorUserId", actorUserId);
        entry.put("actorRole", actorRole);
        entry.put("message", message);
        return entry;
    }
}