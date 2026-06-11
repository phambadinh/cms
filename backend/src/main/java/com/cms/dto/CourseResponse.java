package com.cms.dto;

import com.cms.model.CourseType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
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