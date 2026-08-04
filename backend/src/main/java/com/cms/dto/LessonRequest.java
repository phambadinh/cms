package com.cms.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class LessonRequest {
    private String title;
    private String description;
    private String videoUrl;
    private Integer duration;
    @JsonAlias({"orderIndex"})
    private Integer orderNumber;
    private Boolean published;
}