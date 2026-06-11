package com.cms.service.impl;

import com.cms.dto.CourseRequest;
import com.cms.dto.CourseResponse;
import com.cms.model.Course;
import com.cms.model.CourseView;
import com.cms.model.CourseType;
import com.cms.repository.CourseRepository;
import com.cms.repository.CourseViewRepository;
import com.cms.service.CourseService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;
    private final CourseViewRepository courseViewRepository;

    public CourseServiceImpl(CourseRepository courseRepository, CourseViewRepository courseViewRepository) {
        this.courseRepository = courseRepository;
        this.courseViewRepository = courseViewRepository;
    }

    @Override
    public Course createCourse(CourseRequest request, String instructorId) {
        Course course = new Course();
        course.setCode(request.getCode());
        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setInstructorId(instructorId);
        course.setCourseType(request.getCourseType());
        course.setPrice(request.getPrice());
        course.setCategory(request.getCategory());
        course.setThumbnail(request.getThumbnail());
        course.setLevel(request.getLevel());
        course.setTotalLessons(0);
        course.setRating(0.0);
        course.setEnrollmentCount(0);
        course.setViewCount(0);
        course.setPublished(false);
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    @Override
    public Course getCourseById(String courseId) {
        return courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Khóa học không tìm thấy"));
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public List<Course> getCoursesByInstructor(String instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }

    @Override
    public List<Course> getPublishedCourses() {
        return courseRepository.findByPublishedTrue();
    }

    @Override
    public List<Course> getFreeCourses() {
        return courseRepository.findByCourseType(CourseType.FREE);
    }

    @Override
    public List<Course> getPremiumCourses() {
        return courseRepository.findByCourseType(CourseType.PREMIUM);
    }

    @Override
    public List<Course> getCoursesByCategory(String category) {
        return courseRepository.findByCategory(category);
    }

    @Override
    public Course updateCourse(String courseId, CourseRequest request) {
        Course course = getCourseById(courseId);
        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setCourseType(request.getCourseType());
        course.setPrice(request.getPrice());
        course.setCategory(request.getCategory());
        course.setThumbnail(request.getThumbnail());
        course.setLevel(request.getLevel());
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    @Override
    public void publishCourse(String courseId) {
        Course course = getCourseById(courseId);
        course.setPublished(true);
        courseRepository.save(course);
    }

    @Override
    public void unpublishCourse(String courseId) {
        Course course = getCourseById(courseId);
        course.setPublished(false);
        courseRepository.save(course);
    }

    @Override
    public void deleteCourse(String courseId) {
        courseRepository.deleteById(courseId);
    }

    @Override
    public Course incrementEnrollmentCount(String courseId) {
        Course course = getCourseById(courseId);
        course.setEnrollmentCount(course.getEnrollmentCount() + 1);
        return courseRepository.save(course);
    }

    @Override
    public Course incrementViewCount(String courseId) {
        Course course = getCourseById(courseId);
        Integer currentViewCount = course.getViewCount() == null ? 0 : course.getViewCount();
        course.setViewCount(currentViewCount + 1);
        course.setUpdatedAt(LocalDateTime.now());
        Course saved = courseRepository.save(course);

        CourseView view = new CourseView();
        view.setCourseId(courseId);
        view.setViewedAt(LocalDateTime.now());
        courseViewRepository.save(view);

        return saved;
    }

    @Override
    public CourseResponse toResponse(Course course) {
        return new CourseResponse(
            course.getId(),
            course.getCode(),
            course.getName(),
            course.getDescription(),
            course.getInstructorId(),
            course.getCourseType(),
            course.getPrice(),
            course.getCategory(),
            course.getThumbnail(),
            course.getLevel(),
            course.getTotalLessons(),
            course.getRating(),
            course.getEnrollmentCount(),
            course.getViewCount(),
            course.isPublished(),
            course.getCreatedAt(),
            course.getUpdatedAt()
        );
    }
}