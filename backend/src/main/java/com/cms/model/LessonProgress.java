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
@Document(collection = "lesson_progress")
public class LessonProgress {
    @Id
    private String id;
    private String userId;
    private String lessonId;
    private String courseId;
    private boolean completed;
    private Double watchedDuration; // in seconds
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
