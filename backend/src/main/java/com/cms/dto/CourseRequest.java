package com.cms.dto;

import com.cms.model.CourseType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequest {
    private String code;
    private String name;
    private String description;
    private CourseType courseType;
    private Double price;
    private String category;
    private String thumbnail;
    private String level;
}