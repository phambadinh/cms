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
@Document(collection = "courses")
public class Course {
    @Id
    private String id;
    private String code;
    private String name;
    private String description;
    private String instructorId;
    private CourseType courseType;
    private Double price;
    private String category;
    private String thumbnail;
    private String level;
    private Integer totalLessons;
    private Double rating;
    private Integer enrollmentCount;
    private Integer viewCount;
    private boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}