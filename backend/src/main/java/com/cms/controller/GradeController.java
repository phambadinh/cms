package com.cms.controller;

import com.cms.dto.GradeResponse;
import com.cms.model.Grade;
import com.cms.service.GradeService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/grades")
public class GradeController {
    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    // MENTOR: Get grades for a course
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public List<GradeResponse> getGradesByCourse(@PathVariable String courseId) {
        return gradeService.getGradesByCourse(courseId)
            .stream()
            .map(gradeService::toResponse)
            .toList();
    }

    // STUDENT: Get own grades
    @GetMapping("/my-grades")
    @PreAuthorize("hasRole('STUDENT')")
    public List<GradeResponse> getMyGrades() {
        // This would need the userId from authentication
        return List.of();
    }

    // MENTOR: Create grade for student
    @PostMapping
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public GradeResponse createGrade(
            @RequestParam String userId,
            @RequestParam String courseId,
            @RequestParam Double score) {
        Grade grade = gradeService.createGrade(userId, courseId, score);
        return gradeService.toResponse(grade);
    }

    // MENTOR: Update grade
    @PutMapping("/{gradeId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public GradeResponse updateGrade(
            @PathVariable String gradeId,
            @RequestParam Double score) {
        Grade grade = gradeService.updateGrade(gradeId, score);
        return gradeService.toResponse(grade);
    }
}