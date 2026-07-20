package com.cms.service.impl;

import com.cms.model.Course;
import com.cms.model.CourseType;
import com.cms.model.Enrollment;
import com.cms.model.EnrollmentStatus;
import com.cms.model.PaymentMethod;
import com.cms.model.PaymentStatus;
import com.cms.repository.EnrollmentRepository;
import com.cms.service.CourseService;
import com.cms.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final CourseService courseService;
    private final EnrollmentRepository enrollmentRepository;

    @Value("${payment.return-url:http://localhost:5173}")
    private String paymentReturnUrl;

    public PaymentServiceImpl(CourseService courseService, EnrollmentRepository enrollmentRepository) {
        this.courseService = courseService;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Override
    public String initiatePayment(String userId, String courseId, PaymentMethod paymentMethod) {
        Course course = courseService.getCourseById(courseId);

        if (course.getCourseType() == CourseType.FREE) {
            throw new RuntimeException("Khóa học miễn phí không cần thanh toán.");
        }

        if (course.getPrice() == null) {
            throw new RuntimeException("Khóa học trả phí chưa có giá.");
        }

        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
        if (existingEnrollment.isEmpty()) {
            Enrollment enrollment = new Enrollment();
            enrollment.setUserId(userId);
            enrollment.setCourseId(courseId);
            enrollment.setStatus(EnrollmentStatus.PENDING);
            enrollment.setProgressPercentage(0.0);
            enrollment.setPaymentStatus(PaymentStatus.PENDING);
            enrollment.setEnrolledAt(LocalDateTime.now());
            enrollmentRepository.save(enrollment);
            courseService.incrementEnrollmentCount(courseId);
        } else if (existingEnrollment.get().getPaymentStatus() == PaymentStatus.COMPLETED) {
            throw new RuntimeException("Bạn đã thanh toán và đăng ký khóa học này.");
        }

        String provider = paymentMethod.name();
        String normalizedReturnUrl = paymentReturnUrl.replaceAll("/+$", "");
        String paymentPageUrl = String.format(
            "%s/payment?courseId=%s&paymentMethod=%s&amount=%.0f&userId=%s",
            normalizedReturnUrl,
            URLEncoder.encode(courseId, StandardCharsets.UTF_8),
            URLEncoder.encode(provider, StandardCharsets.UTF_8),
            course.getPrice(),
            URLEncoder.encode(userId, StandardCharsets.UTF_8)
        );

        return paymentPageUrl;
    }

    @Override
    public void completePayment(String userId, String courseId) {
        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Bạn chưa đăng ký khóa học này"));

        enrollment.setPaymentStatus(PaymentStatus.COMPLETED);
        enrollment.setStatus(EnrollmentStatus.ACTIVE);
        enrollment.setPaymentCompletedAt(LocalDateTime.now());
        enrollmentRepository.save(enrollment);
    }
}
