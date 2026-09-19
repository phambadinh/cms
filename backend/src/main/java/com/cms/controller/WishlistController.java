package com.cms.controller;

import com.cms.dto.CourseResponse;
import com.cms.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"https://cmsai.id.vn", "http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public List<CourseResponse> getMyWishlist(Authentication authentication) {
        return wishlistService.getCourses(authentication.getName());
    }

    @PostMapping("/{courseId}/toggle")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> toggleWishlist(@PathVariable String courseId, Authentication authentication) {
        boolean added = wishlistService.toggle(authentication.getName(), courseId);
        return ResponseEntity.ok(Map.of("courseId", courseId, "saved", added));
    }
}