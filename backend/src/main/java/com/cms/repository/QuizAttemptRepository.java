package com.cms.repository;

import com.cms.model.QuizAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizAttemptRepository extends MongoRepository<QuizAttempt, String> {
    List<QuizAttempt> findByUserIdAndQuizId(String userId, String quizId);
    List<QuizAttempt> findByUserId(String userId);
    List<QuizAttempt> findByCourseId(String courseId);
}
