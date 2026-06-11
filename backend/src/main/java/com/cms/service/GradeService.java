package com.cms.service;

import com.cms.dto.GradeResponse;
import com.cms.model.Grade;

import java.util.List;
import java.util.Optional;

public interface GradeService {
    Grade createGrade(String userId, String courseId, Double score);
    Optional<Grade> getGradeByUserAndCourse(String userId, String courseId);
    List<Grade> getGradesByUser(String userId);
    List<Grade> getGradesByCourse(String courseId);
    Grade updateGrade(String gradeId, Double score);
    GradeResponse toResponse(Grade grade);
}