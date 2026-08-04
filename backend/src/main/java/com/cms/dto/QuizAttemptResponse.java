package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptResponse {
    private String id;
    private String quizId;
    private Integer score;
    private Integer totalQuestions;
    private boolean passed;
    private LocalDateTime attemptedAt;
    private Long durationSeconds;
    private Double scorePercentage;
}
