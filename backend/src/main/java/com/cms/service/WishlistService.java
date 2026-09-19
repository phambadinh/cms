package com.cms.service;

import com.cms.dto.CourseResponse;
import com.cms.model.Wishlist;
import com.cms.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final CourseService courseService;

    public WishlistService(WishlistRepository wishlistRepository, CourseService courseService) {
        this.wishlistRepository = wishlistRepository;
        this.courseService = courseService;
    }

    public List<CourseResponse> getCourses(String userId) {
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .map(Wishlist::getCourseId)
            .map(courseService::getCourseById)
            .map(courseService::toResponse)
            .toList();
    }

    public boolean toggle(String userId, String courseId) {
        return wishlistRepository.findByUserIdAndCourseId(userId, courseId)
            .map(existing -> {
                wishlistRepository.delete(existing);
                return false;
            })
            .orElseGet(() -> {
                courseService.getCourseById(courseId);
                wishlistRepository.save(new Wishlist(null, userId, courseId, LocalDateTime.now()));
                return true;
            });
    }
}