package com.cms.repository;

import com.cms.model.Course;
import com.cms.model.CourseType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByInstructorId(String instructorId);
    List<Course> findByCourseType(CourseType courseType);
    List<Course> findByPublishedTrue();
    List<Course> findByCategory(String category);
}
