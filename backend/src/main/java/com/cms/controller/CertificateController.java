package com.cms.controller;

import com.cms.dto.CertificateResponse;
import com.cms.model.Certificate;
import com.cms.model.UserRole;
import com.cms.service.CertificateService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"https://cmsai.id.vn", "http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
@RestController
@RequestMapping("/api/certificates")
public class CertificateController {
    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PostMapping("/issue")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public CertificateResponse issueCertificate(
            @RequestParam String courseId,
            @RequestParam(required = false) String userId,
            Authentication authentication) {
        String issuerUserId = authentication.getName();
        String issuerRole = getPrimaryRole(authentication);
        String targetUserId = resolveTargetUserId(issuerUserId, issuerRole, userId);

        Certificate certificate = certificateService.issueCertificate(
                issuerUserId,
                issuerRole,
                targetUserId,
                courseId
        );

        return certificateService.toResponse(certificate);
    }

    @GetMapping("/my-certificates")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public List<CertificateResponse> getMyCertificates(Authentication authentication) {
        return certificateService.getMyCertificates(authentication.getName())
                .stream()
                .map(certificateService::toResponse)
                .toList();
    }

    @GetMapping("/{certificateId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public CertificateResponse getCertificateById(
            @PathVariable String certificateId,
            Authentication authentication) {
        Certificate certificate = certificateService.getCertificateById(certificateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chứng chỉ"));
        authorizeCertificateAccess(certificate, authentication);
        return certificateService.toResponse(certificate);
    }

    @GetMapping("/user/{userId}/course/{courseId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public CertificateResponse getCertificateByUserAndCourse(
            @PathVariable String userId,
            @PathVariable String courseId,
            Authentication authentication) {
        authorizeUserAccess(authentication, userId);
        Certificate certificate = certificateService.getCertificateByUserAndCourse(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chứng chỉ"));
        return certificateService.toResponse(certificate);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public List<CertificateResponse> getCertificatesByCourse(@PathVariable String courseId) {
        return certificateService.getCertificatesByCourse(courseId)
                .stream()
                .map(certificateService::toResponse)
                .toList();
    }

    @PostMapping("/{certificateId}/revoke")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public CertificateResponse revokeCertificate(
            @PathVariable String certificateId,
            @RequestParam(required = false) String reason,
            Authentication authentication) {
        Certificate certificate = certificateService.revokeCertificate(
                certificateId,
                authentication.getName(),
                reason
        );
        return certificateService.toResponse(certificate);
    }

    @GetMapping("/{certificateId}/verify")
    public ResponseEntity<?> verifyCertificate(@PathVariable String certificateId) {
        Certificate certificate = certificateService.getCertificateById(certificateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chứng chỉ"));
        return ResponseEntity.ok(certificateService.getVerificationStatus(certificate));
    }

    @GetMapping("/{certificateId}/verification-status")
    public ResponseEntity<?> getVerificationStatus(@PathVariable String certificateId) {
        Certificate certificate = certificateService.getCertificateById(certificateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chứng chỉ"));
        return ResponseEntity.ok(certificateService.getVerificationStatus(certificate));
    }

    @GetMapping("/{certificateId}/verification-history")
    public ResponseEntity<?> getVerificationHistory(@PathVariable String certificateId) {
        Certificate certificate = certificateService.getCertificateById(certificateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chứng chỉ"));
        return ResponseEntity.ok(certificateService.getVerificationHistory(certificate));
    }

    @GetMapping(value = "/{certificateId}/viewable", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getViewableCertificate(@PathVariable String certificateId) {
        Certificate certificate = certificateService.getCertificateById(certificateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chứng chỉ"));
        return ResponseEntity.ok(certificateService.buildViewableHtml(certificate));
    }

    private String resolveTargetUserId(String issuerUserId, String issuerRole, String requestedUserId) {
        boolean issuerIsAdminOrMentor = "ADMIN".equalsIgnoreCase(issuerRole) || "MENTOR".equalsIgnoreCase(issuerRole);

        if (issuerIsAdminOrMentor) {
            if (requestedUserId == null || requestedUserId.isBlank()) {
                throw new RuntimeException("Vui lòng chọn student cần cấp chứng chỉ");
            }
            return requestedUserId;
        }

        if (requestedUserId != null && !requestedUserId.isBlank() && !issuerUserId.equals(requestedUserId)) {
            throw new RuntimeException("Student chỉ có thể cấp chứng chỉ cho chính mình");
        }

        return issuerUserId;
    }

    private void authorizeCertificateAccess(Certificate certificate, Authentication authentication) {
        if (hasRole(authentication, UserRole.ADMIN)
                || hasRole(authentication, UserRole.MENTOR)
                || certificate.getUserId().equals(authentication.getName())) {
            return;
        }

        throw new RuntimeException("Bạn không có quyền xem chứng chỉ này");
    }

    private void authorizeUserAccess(Authentication authentication, String userId) {
        if (hasRole(authentication, UserRole.ADMIN)
                || hasRole(authentication, UserRole.MENTOR)
                || authentication.getName().equals(userId)) {
            return;
        }

        throw new RuntimeException("Bạn không có quyền xem chứng chỉ của student này");
    }

    private boolean hasRole(Authentication authentication, UserRole role) {
        String required = "ROLE_" + role.name();
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(required::equalsIgnoreCase);
    }

    private String getPrimaryRole(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority != null && authority.startsWith("ROLE_"))
                .findFirst()
                .map(authority -> authority.substring("ROLE_".length()))
                .orElse("STUDENT");
    }
}