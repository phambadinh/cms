package com.cms.service;

import com.cms.dto.CourseRequest;
import com.cms.dto.CourseResponse;
import com.cms.model.Course;

import java.util.List;

public interface CourseService {
    Course createCourse(CourseRequest request, String instructorId);
    Course getCourseById(String courseId);
    List<Course> getAllCourses();
    List<Course> getCoursesByInstructor(String instructorId);
    List<Course> getPublishedCourses();
    List<Course> getFreeCourses();
    List<Course> getPremiumCourses();
    List<Course> getCoursesByCategory(String category);
    Course updateCourse(String courseId, CourseRequest request);
    void publishCourse(String courseId);
    void unpublishCourse(String courseId);
    void deleteCourse(String courseId);
    Course incrementEnrollmentCount(String courseId);
    Course incrementViewCount(String courseId);
    CourseResponse toResponse(Course course);
}