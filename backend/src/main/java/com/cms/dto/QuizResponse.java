package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResponse {
    private String id;
    private String lessonId;
    private String courseId;
    private String title;
    private String description;
    private Integer passingScore;
    private List<QuestionResponse> questions;
    private boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
