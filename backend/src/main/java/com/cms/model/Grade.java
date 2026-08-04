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
@Document(collection = "grades")
public class Grade {
    @Id
    private String id;
    private String userId;
    private String courseId;
    private Double score;
    private Double totalScore; // Tổng điểm toàn khóa
    private String grade; // A, B, C, D, F
    private LocalDateTime evaluatedAt;
}
