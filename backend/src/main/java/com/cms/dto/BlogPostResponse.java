package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostResponse {
    private String id;
    private String title;
    private String slug;
    private String date;
    private String tag;
    private String excerpt;
    private String content;
    private String authorId;
    private String authorName;
    private String coverImage;
    private boolean featured;
    private boolean published;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}