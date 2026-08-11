package com.cms.controller;

import com.cms.dto.BlogPostRequest;
import com.cms.dto.BlogPostResponse;
import com.cms.model.BlogPost;
import com.cms.service.BlogPostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"https://cmsai.id.vn", "http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
@RestController
@RequestMapping("/api/blog-posts")
public class BlogPostController {
    private final BlogPostService blogPostService;

    public BlogPostController(BlogPostService blogPostService) {
        this.blogPostService = blogPostService;
    }

    @GetMapping("/public")
    public Page<BlogPostResponse> getPublishedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        Page<BlogPost> blogPosts = blogPostService.getPublishedPosts(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );

        return blogPosts.map(blogPostService::toResponse);
    }

    @GetMapping("/public/featured")
    public List<BlogPostResponse> getFeaturedPosts() {
        return blogPostService.getFeaturedPosts()
                .stream()
                .map(blogPostService::toResponse)
                .toList();
    }

    @GetMapping("/public/tag/{tag}")
    public List<BlogPostResponse> getPostsByTag(@PathVariable String tag) {
        return blogPostService.getPostsByTag(tag)
                .stream()
                .map(blogPostService::toResponse)
                .toList();
    }

    @GetMapping("/public/slug/{slug}")
    public BlogPostResponse getPostBySlug(@PathVariable String slug) {
        BlogPost blogPost = blogPostService.incrementViewCount(
                blogPostService.getPostBySlug(slug).getId()
        );
        return blogPostService.toResponse(blogPost);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public List<BlogPostResponse> getAllPosts() {
        return blogPostService.getAllPosts()
                .stream()
                .map(blogPostService::toResponse)
                .toList();
    }

    @GetMapping("/{postId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public BlogPostResponse getPost(@PathVariable String postId) {
        return blogPostService.toResponse(blogPostService.getPostById(postId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public BlogPostResponse createPost(
            @RequestBody BlogPostRequest request,
            Authentication authentication) {
        String authorId = authentication.getName();
        String authorName = authentication.getName();
        BlogPost blogPost = blogPostService.createPost(request, authorId, authorName);
        return blogPostService.toResponse(blogPost);
    }

    @PutMapping("/{postId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public BlogPostResponse updatePost(
            @PathVariable String postId,
            @RequestBody BlogPostRequest request) {
        BlogPost blogPost = blogPostService.updatePost(postId, request);
        return blogPostService.toResponse(blogPost);
    }

    @PostMapping("/{postId}/publish")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public void publishPost(@PathVariable String postId) {
        blogPostService.publishPost(postId);
    }

    @PostMapping("/{postId}/unpublish")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public void unpublishPost(@PathVariable String postId) {
        blogPostService.unpublishPost(postId);
    }

    @DeleteMapping("/{postId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public void deletePost(@PathVariable String postId) {
        blogPostService.deletePost(postId);
    }
}