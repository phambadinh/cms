package com.cms.repository;

import com.cms.model.LessonProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends MongoRepository<LessonProgress, String> {
    Optional<LessonProgress> findByUserIdAndLessonId(String userId, String lessonId);
    List<LessonProgress> findByUserId(String userId);
    List<LessonProgress> findByCourseId(String courseId);
    long countByLessonIdAndCompleted(String lessonId, boolean completed);
}
