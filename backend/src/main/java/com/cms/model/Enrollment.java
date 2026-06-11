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
    private String status; // ACTIVE, COMPLETED, INACTIVE
    private Double progressPercentage;
    private Integer lastLessonId;
    private Double paymentAmount;
    private String paymentStatus; // PENDING, COMPLETED, REFUNDED
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;
}