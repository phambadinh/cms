package com.cms.controller;

import com.cms.dto.CourseRequest;
import com.cms.dto.CourseResponse;
import com.cms.model.Course;
import com.cms.service.CourseService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // PUBLIC: Xem các khóa học đã công bố
    @GetMapping("/public")
    public List<CourseResponse> getPublishedCourses() {
        return courseService.getPublishedCourses()
            .stream()
            .map(courseService::toResponse)
            .toList();
    }

    // ADMIN: Xem tất cả khóa học
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<CourseResponse> getAllCourses() {
        return courseService.getAllCourses()
            .stream()
            .map(courseService::toResponse)
            .toList();
    }

    // PUBLIC: Xem khóa học miễn phí
    @GetMapping("/public/free")
    public List<CourseResponse> getFreeCourses() {
        return courseService.getFreeCourses()
            .stream()
            .map(courseService::toResponse)
            .toList();
    }

    // PUBLIC: Xem khóa học trả phí
    @GetMapping("/public/premium")
    public List<CourseResponse> getPremiumCourses() {
        return courseService.getPremiumCourses()
            .stream()
            .map(courseService::toResponse)
            .toList();
    }

    // PUBLIC: Xem khóa học theo danh mục
    @GetMapping("/public/category/{category}")
    public List<CourseResponse> getCoursesByCategory(@PathVariable String category) {
        return courseService.getCoursesByCategory(category)
            .stream()
            .map(courseService::toResponse)
            .toList();
    }

    // PUBLIC: Xem chi tiết khóa học
    @GetMapping("/{courseId}")
    public CourseResponse getCourse(@PathVariable String courseId) {
        Course course = courseService.incrementViewCount(courseId);
        return courseService.toResponse(course);
    }

    // MENTOR: Xem các khóa học của mình
    @GetMapping("/my-courses")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public List<CourseResponse> getMyCourses(Authentication authentication) {
        String instructorId = authentication.getName();
        return courseService.getCoursesByInstructor(instructorId)
            .stream()
            .map(courseService::toResponse)
            .toList();
    }

    // MENTOR: Tạo khóa học mới
    @PostMapping
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public CourseResponse createCourse(
            @RequestBody CourseRequest request,
            Authentication authentication) {
        String instructorId = authentication.getName();
        Course course = courseService.createCourse(request, instructorId);
        return courseService.toResponse(course);
    }

    // MENTOR: Cập nhật khóa học
    @PutMapping("/{courseId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public CourseResponse updateCourse(
            @PathVariable String courseId,
            @RequestBody CourseRequest request) {
        Course course = courseService.updateCourse(courseId, request);
        return courseService.toResponse(course);
    }

    // MENTOR: Công bố khóa học
    @PostMapping("/{courseId}/publish")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public void publishCourse(@PathVariable String courseId) {
        courseService.publishCourse(courseId);
    }

    // MENTOR: Hủy công bố khóa học
    @PostMapping("/{courseId}/unpublish")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public void unpublishCourse(@PathVariable String courseId) {
        courseService.unpublishCourse(courseId);
    }

    // MENTOR: Xóa khóa học
    @DeleteMapping("/{courseId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public void deleteCourse(@PathVariable String courseId) {
        courseService.deleteCourse(courseId);
    }
}