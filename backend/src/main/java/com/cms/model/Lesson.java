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
@Document(collection = "lessons")
public class Lesson {
    @Id
    private String id;
    private String courseId;
    private String title;
    private String description;
    private String videoUrl;
    private Integer duration; // in seconds
    private Integer orderNumber;
    private boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
