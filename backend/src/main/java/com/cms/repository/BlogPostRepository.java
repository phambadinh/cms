package com.cms.repository;

import com.cms.model.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends MongoRepository<BlogPost, String> {
    Page<BlogPost> findByPublishedTrue(Pageable pageable);
    List<BlogPost> findByPublishedTrueOrderByCreatedAtDesc();
    List<BlogPost> findByFeaturedTrueAndPublishedTrueOrderByCreatedAtDesc();
    List<BlogPost> findByTagIgnoreCaseAndPublishedTrueOrderByCreatedAtDesc(String tag);
    Optional<BlogPost> findBySlug(String slug);
    boolean existsBySlug(String slug);
}