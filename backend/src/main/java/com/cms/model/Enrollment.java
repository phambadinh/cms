package com.cms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "enrollments")
public class Enrollment {
    @Id
    private String id;
    private String userId;
    private String courseId;
    private EnrollmentStatus status;
    private Double progressPercentage;
    private String lastLessonId;
    private Double paymentAmount;
    private PaymentStatus paymentStatus;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;
    private LocalDateTime paymentCompletedAt;
    private String paymentMethod;
    private String transactionId;
    private String sessionId;
}