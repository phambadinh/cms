package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeResponse {
    private String id;
    private String userId;
    private String courseId;
    private Double score;
    private Double totalScore;
    private String grade;
    private LocalDateTime evaluatedAt;
}