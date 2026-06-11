package com.cms.service;

import com.cms.dto.EnrollmentRequest;
import com.cms.dto.EnrollmentResponse;
import com.cms.model.Enrollment;

import java.util.List;
import java.util.Optional;

public interface EnrollmentService {
    Enrollment enrollInCourse(String userId, EnrollmentRequest request);
    List<Enrollment> getUserEnrollments(String userId);
    List<Enrollment> getCourseEnrollments(String courseId);
    Optional<Enrollment> getUserCourseEnrollment(String userId, String courseId);
    Enrollment updateEnrollmentProgress(String enrollmentId, Double progressPercentage);
    void completeEnrollment(String enrollmentId);
    void unenrollFromCourse(String enrollmentId);
    EnrollmentResponse toResponse(Enrollment enrollment);
}