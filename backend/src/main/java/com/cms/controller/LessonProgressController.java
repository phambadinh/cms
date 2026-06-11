package com.cms.controller;

import com.cms.dto.LessonProgressResponse;
import com.cms.model.LessonProgress;
import com.cms.service.LessonProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/lesson-progress")
public class LessonProgressController {
    @Autowired
    private LessonProgressService progressService;

    // STUDENT: Bắt đầu xem bài học
    @PostMapping("/{lessonId}/start")
    @PreAuthorize("hasRole('STUDENT')")
    public LessonProgressResponse startLesson(
            @PathVariable String lessonId,
            @RequestParam String courseId,
            Authentication authentication) {
        String userId = authentication.getName();
        LessonProgress progress = progressService.startLesson(userId, lessonId, courseId);
        return progressService.toResponse(progress);
    }

    // STUDENT: Cập nhật tiến độ xem video
    @PutMapping("/{lessonId}/update")
    @PreAuthorize("hasRole('STUDENT')")
    public LessonProgressResponse updateProgress(
            @PathVariable String lessonId,
            @RequestParam Double watchedDuration,
            Authentication authentication) {
        String userId = authentication.getName();
        LessonProgress progress = progressService.updateProgress(userId, lessonId, watchedDuration);
        return progressService.toResponse(progress);
    }

    // STUDENT: Hoàn thành bài học
    @PostMapping("/{lessonId}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    public LessonProgressResponse completeLesson(
            @PathVariable String lessonId,
            Authentication authentication) {
        String userId = authentication.getName();
        LessonProgress progress = progressService.completeLesson(userId, lessonId);
        return progressService.toResponse(progress);
    }

    // STUDENT: Lấy tiến độ của bài học
    @GetMapping("/{lessonId}")
    @PreAuthorize("hasRole('STUDENT')")
    public LessonProgressResponse getProgress(
            @PathVariable String lessonId,
            Authentication authentication) {
        String userId = authentication.getName();
        LessonProgress progress = progressService.getProgress(userId, lessonId);
        return progressService.toResponse(progress);
    }
}
