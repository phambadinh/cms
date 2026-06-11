package com.cms.repository;

import com.cms.model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends MongoRepository<Quiz, String> {
    Optional<Quiz> findByLessonId(String lessonId);
    List<Quiz> findByCourseId(String courseId);
}
