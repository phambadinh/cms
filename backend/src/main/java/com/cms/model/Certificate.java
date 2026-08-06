package com.cms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "certificates")
public class Certificate {
    @Id
    private String id;
    private String userId;
    private String courseId;
    private String certificateCode;
    private String issuedByUserId;
    private String issuedByRole;
    private boolean verified;
    private boolean revoked;
    private String revokedByUserId;
    private String revokeReason;
    private LocalDateTime issueDate;
    private LocalDateTime verifiedAt;
    private LocalDateTime revokedAt;
}