package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateResponse {
    private String id;
    private String userId;
    private String userName;
    private String fullName;
    private String courseId;
    private String courseName;
    private String certificateCode;
    private String certificateUrl;
    private boolean verified;
    private boolean revoked;
    private String issuedByUserId;
    private String issuedByUsername;
    private String issuedByFullName;
    private String issuedByRole;
    private String revokedByUserId;
    private String revokeReason;
    private LocalDateTime issueDate;
    private LocalDateTime verifiedAt;
    private LocalDateTime revokedAt;
}