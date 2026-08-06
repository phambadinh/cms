package com.cms.service;

import com.cms.dto.CertificateResponse;
import com.cms.model.Certificate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface CertificateService {
    Certificate issueCertificate(String issuerUserId, String issuerRole, String targetUserId, String courseId);

    List<Certificate> getMyCertificates(String userId);

    List<Certificate> getCertificatesByCourse(String courseId);

    Optional<Certificate> getCertificateById(String certificateId);

    Optional<Certificate> getCertificateByUserAndCourse(String userId, String courseId);

    Certificate revokeCertificate(String certificateId, String revokedByUserId, String revokeReason);

    CertificateResponse toResponse(Certificate certificate);

    Map<String, Object> getVerificationStatus(Certificate certificate);

    List<Map<String, Object>> getVerificationHistory(Certificate certificate);

    String buildViewableHtml(Certificate certificate);
}