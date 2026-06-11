package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonProgressResponse {
    private String id;
    private String userId;
    private String lessonId;
    private String courseId;
    private boolean completed;
    private Double watchedDuration;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
