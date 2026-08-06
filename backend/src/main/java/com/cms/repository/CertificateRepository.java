package com.cms.repository;

import com.cms.model.Certificate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends MongoRepository<Certificate, String> {
    List<Certificate> findByUserId(String userId);

    List<Certificate> findByCourseId(String courseId);

    Optional<Certificate> findByUserIdAndCourseId(String userId, String courseId);
}