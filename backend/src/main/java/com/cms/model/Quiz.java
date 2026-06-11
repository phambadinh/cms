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
@Document(collection = "quizzes")
public class Quiz {
    @Id
    private String id;
    private String lessonId;
    private String courseId;
    private String title;
    private String description;
    private Integer passingScore; // Điểm đạt: 70
    private List<String> questionIds;
    private boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
