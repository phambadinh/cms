package com.cms.service.impl;

import com.cms.dto.GradeResponse;
import com.cms.model.Grade;
import com.cms.repository.GradeRepository;
import com.cms.service.GradeService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GradeServiceImpl implements GradeService {
    private final GradeRepository gradeRepository;

    public GradeServiceImpl(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    @Override
    public Grade createGrade(String userId, String courseId, Double score) {
        Grade grade = new Grade();
        grade.setUserId(userId);
        grade.setCourseId(courseId);
        grade.setScore(score);
        grade.setTotalScore(score);
        grade.setEvaluatedAt(LocalDateTime.now());
        return gradeRepository.save(grade);
    }

    @Override
    public Optional<Grade> getGradeByUserAndCourse(String userId, String courseId) {
        return gradeRepository.findByUserIdAndCourseId(userId, courseId);
    }

    @Override
    public List<Grade> getGradesByUser(String userId) {
        return gradeRepository.findByUserId(userId);
    }

    @Override
    public List<Grade> getGradesByCourse(String courseId) {
        return gradeRepository.findByCourseId(courseId);
    }
    @SuppressWarnings("null")
    @Override
    public Grade updateGrade(String gradeId, Double score) {
        Grade grade = gradeRepository.findById(gradeId)
            .orElseThrow(() -> new RuntimeException("Điểm không tìm thấy"));
        grade.setScore(score);
        grade.setTotalScore(score);
        grade.setEvaluatedAt(LocalDateTime.now());
        return gradeRepository.save(grade);
    }

    @Override
    public GradeResponse toResponse(Grade grade) {
        return new GradeResponse(
            grade.getId(),
            grade.getUserId(),
            grade.getCourseId(),
            grade.getScore(),
            grade.getTotalScore(),
            grade.getGrade(),
            grade.getEvaluatedAt()
        );
    }
}