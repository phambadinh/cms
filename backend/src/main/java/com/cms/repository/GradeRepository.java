package com.cms.repository;

import com.cms.model.Grade;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends MongoRepository<Grade, String> {
    Optional<Grade> findByUserIdAndCourseId(String userId, String courseId);
    List<Grade> findByUserId(String userId);
    List<Grade> findByCourseId(String courseId);
}
