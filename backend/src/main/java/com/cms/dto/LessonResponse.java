package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonResponse {
    private String id;
    private String courseId;
    private String title;
    private String description;
    private String videoUrl;
    private Integer duration;
    private Integer orderNumber;
    private boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}