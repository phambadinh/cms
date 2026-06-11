package com.cms.service;

import com.cms.dto.LessonRequest;
import com.cms.dto.LessonResponse;
import com.cms.model.Lesson;

import java.util.List;

public interface LessonService {
    Lesson createLesson(String courseId, LessonRequest request);
    Lesson getLessonById(String lessonId);
    List<Lesson> getLessonsByCourse(String courseId);
    Lesson updateLesson(String lessonId, LessonRequest request);
    void publishLesson(String lessonId);
    void unpublishLesson(String lessonId);
    void deleteLesson(String lessonId);
    LessonResponse toResponse(Lesson lesson);
}