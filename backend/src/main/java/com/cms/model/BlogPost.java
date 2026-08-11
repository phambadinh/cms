package com.cms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "blog_posts")
public class BlogPost {
    @Id
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