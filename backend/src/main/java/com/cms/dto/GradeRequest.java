package com.cms.dto;
import lombok.Data;

@Data
public class GradeRequest {
    private String userId;
    private String courseId;
    private Double score;
}