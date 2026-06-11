package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptRequest {
    private String quizId;
    private List<Integer> selectedAnswers;
    private Long durationSeconds;
}
