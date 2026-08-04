package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizRequest {
    private String lessonId;
    private String courseId;
    private String title;
    private String description;
    private Integer passingScore;
}
