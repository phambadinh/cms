package com.cms.service.impl;

import com.cms.dto.EnrollmentRequest;
import com.cms.dto.EnrollmentResponse;
import com.cms.model.Course;
import com.cms.model.CourseType;
import com.cms.model.Enrollment;
import com.cms.model.EnrollmentStatus;
import com.cms.model.PaymentStatus;
import com.cms.repository.EnrollmentRepository;
import com.cms.service.CourseService;
import com.cms.service.EnrollmentService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final CourseService courseService;

    public EnrollmentServiceImpl(EnrollmentRepository enrollmentRepository, CourseService courseService) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseService = courseService;
    }

    @Override
    public Enrollment enrollInCourse(String userId, EnrollmentRequest request) {
        // Check if already enrolled
        Optional<Enrollment> existing = enrollmentRepository.findByUserIdAndCourseId(userId, request.getCourseId());
        if (existing.isPresent()) {
            throw new RuntimeException("Bạn đã đăng ký khóa học này rồi");
        }

        Course course = courseService.getCourseById(request.getCourseId());

        // For premium courses, would need payment processing
        if (course.getCourseType() == CourseType.PREMIUM && course.getPrice() == null) {
            throw new RuntimeException("Khóa học trả phí không có giá");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUserId(userId);
        enrollment.setCourseId(request.getCourseId());
        enrollment.setStatus(EnrollmentStatus.ACTIVE);
        enrollment.setProgressPercentage(0.0);
        enrollment.setPaymentStatus(course.getCourseType() == CourseType.FREE ? PaymentStatus.COMPLETED : PaymentStatus.PENDING);
        enrollment.setEnrolledAt(LocalDateTime.now());

        Enrollment saved = enrollmentRepository.save(enrollment);
        
        // Increment enrollment count
        courseService.incrementEnrollmentCount(request.getCourseId());
        
        return saved;
    }

    @Override
    public List<Enrollment> getUserEnrollments(String userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    @Override
    public List<Enrollment> getCourseEnrollments(String courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    @Override
    public Optional<Enrollment> getUserCourseEnrollment(String userId, String courseId) {
        return enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
    }
    @SuppressWarnings("null")
    @Override
    public Enrollment updateEnrollmentProgress(String enrollmentId, Double progressPercentage) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký"));
        
        enrollment.setProgressPercentage(progressPercentage);
        
        // Mark as completed if progress is 100%
        if (progressPercentage >= 100.0) {
            enrollment.setStatus(EnrollmentStatus.COMPLETED);
            enrollment.setCompletedAt(LocalDateTime.now());
        }
        
        return enrollmentRepository.save(enrollment);
    }
    @SuppressWarnings("null")
    @Override
    public void completeEnrollment(String enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký"));
        
        enrollment.setStatus(EnrollmentStatus.COMPLETED);
        enrollment.setCompletedAt(LocalDateTime.now());
        enrollment.setProgressPercentage(100.0);
        enrollmentRepository.save(enrollment);
    }
    @SuppressWarnings("null")
    @Override
    public void unenrollFromCourse(String enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký"));
        
        enrollment.setStatus(EnrollmentStatus.INACTIVE);
        enrollmentRepository.save(enrollment);
    }

    @Override
    public EnrollmentResponse toResponse(Enrollment enrollment) {
        return new EnrollmentResponse(
            enrollment.getId(),
            enrollment.getUserId(),
            enrollment.getCourseId(),
            enrollment.getStatus() != null ? enrollment.getStatus().name() : null,
            enrollment.getProgressPercentage(),
            enrollment.getPaymentStatus() != null ? enrollment.getPaymentStatus().name() : null,
            enrollment.getEnrolledAt(),
            enrollment.getCompletedAt()
        );
    }
}