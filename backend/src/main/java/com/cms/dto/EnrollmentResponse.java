package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponse {
    private String id;
    private String userId;
    private String courseId;
    private String status;
    private Double progressPercentage;
    private String paymentStatus;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;
}