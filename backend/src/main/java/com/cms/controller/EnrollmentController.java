package com.cms.controller;

import com.cms.dto.EnrollmentRequest;
import com.cms.dto.EnrollmentResponse;
import com.cms.model.Enrollment;
import com.cms.service.EnrollmentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    // STUDENT: Đăng ký khóa học
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public EnrollmentResponse enrollInCourse(
            @RequestBody EnrollmentRequest request,
            Authentication authentication) {
        String userId = authentication.getName();
        Enrollment enrollment = enrollmentService.enrollInCourse(userId, request);
        return enrollmentService.toResponse(enrollment);
    }

    // STUDENT: Xem các khóa học đã đăng ký
    @GetMapping("/my-enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public List<EnrollmentResponse> getMyEnrollments(Authentication authentication) {
        String userId = authentication.getName();
        return enrollmentService.getUserEnrollments(userId)
            .stream()
            .map(enrollmentService::toResponse)
            .toList();
    }

    // STUDENT: Xem chi tiết đăng ký khóa học
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public EnrollmentResponse getEnrollment(
            @PathVariable String courseId,
            Authentication authentication) {
        String userId = authentication.getName();
        Enrollment enrollment = enrollmentService.getUserCourseEnrollment(userId, courseId)
            .orElseThrow(() -> new RuntimeException("Bạn chưa đăng ký khóa học này"));
        return enrollmentService.toResponse(enrollment);
    }

    // MENTOR: Xem danh sách học sinh trong khóa học
    @GetMapping("/course/{courseId}/students")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public List<EnrollmentResponse> getCourseEnrollments(@PathVariable String courseId) {
        return enrollmentService.getCourseEnrollments(courseId)
            .stream()
            .map(enrollmentService::toResponse)
            .toList();
    }

    // STUDENT: Cập nhật tiến độ học tập
    @PutMapping("/{enrollmentId}/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public EnrollmentResponse updateProgress(
            @PathVariable String enrollmentId,
            @RequestParam Double progressPercentage) {
        Enrollment enrollment = enrollmentService.updateEnrollmentProgress(enrollmentId, progressPercentage);
        return enrollmentService.toResponse(enrollment);
    }

    // STUDENT: Hoàn thành khóa học
    @PostMapping("/{enrollmentId}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    public void completeEnrollment(@PathVariable String enrollmentId) {
        enrollmentService.completeEnrollment(enrollmentId);
    }

    // STUDENT: Hủy đăng ký khóa học
    @PostMapping("/{enrollmentId}/unenroll")
    @PreAuthorize("hasRole('STUDENT')")
    public void unenrollFromCourse(@PathVariable String enrollmentId) {
        enrollmentService.unenrollFromCourse(enrollmentId);
    }
}