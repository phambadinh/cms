package com.cms.service;

import com.cms.dto.BlogPostRequest;
import com.cms.dto.BlogPostResponse;
import com.cms.model.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BlogPostService {
    BlogPost createPost(BlogPostRequest request, String authorId, String authorName);
    BlogPost getPostById(String postId);
    BlogPost getPostBySlug(String slug);
    BlogPost incrementViewCount(String postId);
    Page<BlogPost> getPublishedPosts(Pageable pageable);
    List<BlogPost> getAllPosts();
    List<BlogPost> getPublishedPosts();
    List<BlogPost> getFeaturedPosts();
    List<BlogPost> getPostsByTag(String tag);
    BlogPost updatePost(String postId, BlogPostRequest request);
    void publishPost(String postId);
    void unpublishPost(String postId);
    void deletePost(String postId);
    BlogPostResponse toResponse(BlogPost blogPost);
}