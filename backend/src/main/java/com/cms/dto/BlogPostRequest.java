package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostRequest {
    private String title;
    private String slug;
    private String date;
    private String tag;
    private String excerpt;
    private String content;
    private String coverImage;
    private boolean featured;
    private boolean published;
}