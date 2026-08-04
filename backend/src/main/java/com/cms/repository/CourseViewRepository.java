package com.cms.repository;

import com.cms.model.CourseView;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CourseViewRepository extends MongoRepository<CourseView, String> {
    List<CourseView> findByViewedAtAfter(LocalDateTime viewedAt);
    List<CourseView> findByCourseId(String courseId);
}