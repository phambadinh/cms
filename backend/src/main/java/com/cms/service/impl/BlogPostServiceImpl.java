package com.cms.service.impl;

import com.cms.dto.BlogPostRequest;
import com.cms.dto.BlogPostResponse;
import com.cms.model.BlogPost;
import com.cms.repository.BlogPostRepository;
import com.cms.service.BlogPostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class BlogPostServiceImpl implements BlogPostService {
    private final BlogPostRepository blogPostRepository;

    public BlogPostServiceImpl(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    @Override
    public BlogPost createPost(BlogPostRequest request, String authorId, String authorName) {
        BlogPost blogPost = new BlogPost();
        applyRequest(blogPost, request);
        blogPost.setAuthorId(authorId);
        blogPost.setAuthorName(authorName);
        blogPost.setViewCount(0);
        blogPost.setCreatedAt(LocalDateTime.now());
        blogPost.setUpdatedAt(LocalDateTime.now());
        return blogPostRepository.save(blogPost);
    }

    @SuppressWarnings("null")
    @Override
    public BlogPost getPostById(String postId) {
        return blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Bài viết không tìm thấy"));
    }

    @SuppressWarnings("null")
    @Override
    public BlogPost getPostBySlug(String slug) {
        return blogPostRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Bài viết không tìm thấy"));
    }

    @Override
    public BlogPost incrementViewCount(String postId) {
        BlogPost blogPost = getPostById(postId);
        Integer currentViewCount = blogPost.getViewCount() == null ? 0 : blogPost.getViewCount();
        blogPost.setViewCount(currentViewCount + 1);
        blogPost.setUpdatedAt(LocalDateTime.now());
        return blogPostRepository.save(blogPost);
    }

    @Override
    public Page<BlogPost> getPublishedPosts(Pageable pageable) {
        return blogPostRepository.findByPublishedTrue(pageable);
    }

    @Override
    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    @Override
    public List<BlogPost> getPublishedPosts() {
        return blogPostRepository.findByPublishedTrueOrderByCreatedAtDesc();
    }

    @Override
    public List<BlogPost> getFeaturedPosts() {
        return blogPostRepository.findByFeaturedTrueAndPublishedTrueOrderByCreatedAtDesc();
    }

    @Override
    public List<BlogPost> getPostsByTag(String tag) {
        return blogPostRepository.findByTagIgnoreCaseAndPublishedTrueOrderByCreatedAtDesc(tag);
    }

    @Override
    public BlogPost updatePost(String postId, BlogPostRequest request) {
        BlogPost blogPost = getPostById(postId);
        applyRequest(blogPost, request);
        blogPost.setUpdatedAt(LocalDateTime.now());
        return blogPostRepository.save(blogPost);
    }

    @Override
    public void publishPost(String postId) {
        BlogPost blogPost = getPostById(postId);
        blogPost.setPublished(true);
        blogPost.setUpdatedAt(LocalDateTime.now());
        blogPostRepository.save(blogPost);
    }

    @Override
    public void unpublishPost(String postId) {
        BlogPost blogPost = getPostById(postId);
        blogPost.setPublished(false);
        blogPost.setUpdatedAt(LocalDateTime.now());
        blogPostRepository.save(blogPost);
    }

    @SuppressWarnings("null")
    @Override
    public void deletePost(String postId) {
        blogPostRepository.deleteById(postId);
    }

    @Override
    public BlogPostResponse toResponse(BlogPost blogPost) {
        return new BlogPostResponse(
                blogPost.getId(),
                blogPost.getTitle(),
                blogPost.getSlug(),
                blogPost.getDate(),
                blogPost.getTag(),
                blogPost.getExcerpt(),
                blogPost.getContent(),
                blogPost.getAuthorId(),
                blogPost.getAuthorName(),
                blogPost.getCoverImage(),
                blogPost.isFeatured(),
                blogPost.isPublished(),
                blogPost.getViewCount(),
                blogPost.getCreatedAt(),
                blogPost.getUpdatedAt()
        );
    }

    private void applyRequest(BlogPost blogPost, BlogPostRequest request) {
        blogPost.setTitle(request.getTitle());
        blogPost.setSlug(resolveSlug(request.getSlug(), request.getTitle()));
        blogPost.setDate(resolveDate(request.getDate()));
        blogPost.setTag(request.getTag());
        blogPost.setExcerpt(request.getExcerpt());
        blogPost.setContent(request.getContent());
        blogPost.setCoverImage(request.getCoverImage());
        blogPost.setFeatured(request.isFeatured());
        blogPost.setPublished(request.isPublished());
    }

    private String resolveSlug(String slug, String title) {
        if (slug != null && !slug.isBlank()) {
            return slug.trim().toLowerCase(Locale.ROOT);
        }

        if (title == null || title.isBlank()) {
            return null;
        }

        String normalized = title.trim().toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\p{IsAlphabetic}]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        return normalized.isBlank() ? null : normalized;
    }

    private String resolveDate(String date) {
        if (date != null && !date.isBlank()) {
            return date;
        }
        return LocalDate.now().toString();
    }
}