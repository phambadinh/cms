package com.cms.service.impl;

import com.cms.model.Course;
import com.cms.model.CourseType;
import com.cms.model.PaymentMethod;
import com.cms.service.CourseService;
import com.cms.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final CourseService courseService;

    @Value("${payment.return-url:http://localhost:5173}")
    private String paymentReturnUrl;

    public PaymentServiceImpl(CourseService courseService) {
        this.courseService = courseService;
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

        String provider = paymentMethod.name();
        String encodedReturnUrl = URLEncoder.encode(paymentReturnUrl, StandardCharsets.UTF_8);

        return String.format(
            "https://sandbox-payment.example.com/checkout?provider=%s&courseId=%s&amount=%.0f&userId=%s&returnUrl=%s",
            provider,
            courseId,
            course.getPrice(),
            userId,
            encodedReturnUrl
        );
    }
}
