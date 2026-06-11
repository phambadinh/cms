package com.cms.controller;

import com.cms.dto.LessonRequest;
import com.cms.dto.LessonResponse;
import com.cms.model.Lesson;
import com.cms.service.LessonService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/lessons")
public class LessonController {
    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    // PUBLIC: Xem các bài học của khóa học
    @GetMapping("/course/{courseId}")
    public List<LessonResponse> getLessonsByCourse(@PathVariable String courseId) {
        return lessonService.getLessonsByCourse(courseId)
            .stream()
            .map(lessonService::toResponse)
            .toList();
    }

    // STUDENT/MENTOR: Xem chi tiết bài học
    @GetMapping("/{lessonId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public LessonResponse getLesson(@PathVariable String lessonId) {
        return lessonService.toResponse(lessonService.getLessonById(lessonId));
    }

    // MENTOR: Tạo bài học mới
    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public LessonResponse createLesson(
            @PathVariable String courseId,
            @RequestBody LessonRequest request) {
        Lesson lesson = lessonService.createLesson(courseId, request);
        return lessonService.toResponse(lesson);
    }

    // MENTOR: Cập nhật bài học
    @PutMapping("/{lessonId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public LessonResponse updateLesson(
            @PathVariable String lessonId,
            @RequestBody LessonRequest request) {
        Lesson lesson = lessonService.updateLesson(lessonId, request);
        return lessonService.toResponse(lesson);
    }

    // MENTOR: Công bố bài học
    @PostMapping("/{lessonId}/publish")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public void publishLesson(@PathVariable String lessonId) {
        lessonService.publishLesson(lessonId);
    }

    // MENTOR: Hủy công bố bài học
    @PostMapping("/{lessonId}/unpublish")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public void unpublishLesson(@PathVariable String lessonId) {
        lessonService.unpublishLesson(lessonId);
    }

    // MENTOR: Xóa bài học
    @DeleteMapping("/{lessonId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public void deleteLesson(@PathVariable String lessonId) {
        lessonService.deleteLesson(lessonId);
    }
}