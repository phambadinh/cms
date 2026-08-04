package com.cms.repository;

import com.cms.model.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonRepository extends MongoRepository<Lesson, String> {
    List<Lesson> findByCourseId(String courseId);
    List<Lesson> findByCourseIdOrderByOrderNumber(String courseId);
}
