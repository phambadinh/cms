package com.cms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "quiz_attempts")
public class QuizAttempt {
    @Id
    private String id;
    private String quizId;
    private String userId;
    private String courseId;
    private Integer score;
    private Integer totalQuestions;
    private List<Integer> selectedAnswers; // Index của các câu trả lời được chọn
    private boolean passed;
    private LocalDateTime attemptedAt;
    private Long durationSeconds; // Thời gian làm bài (giây)
}
