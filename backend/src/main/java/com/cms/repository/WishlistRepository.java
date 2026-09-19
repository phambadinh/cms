package com.cms.repository;

import com.cms.model.Wishlist;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    List<Wishlist> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<Wishlist> findByUserIdAndCourseId(String userId, String courseId);
}