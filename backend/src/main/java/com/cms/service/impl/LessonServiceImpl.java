package com.cms.service.impl;

import com.cms.dto.LessonRequest;
import com.cms.dto.LessonResponse;
import com.cms.model.Lesson;
import com.cms.repository.LessonRepository;
import com.cms.service.LessonService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LessonServiceImpl implements LessonService {
    private final LessonRepository lessonRepository;

    public LessonServiceImpl(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    @Override
    public Lesson createLesson(String courseId, LessonRequest request) {
        Lesson lesson = new Lesson();
        lesson.setCourseId(courseId);
        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setDuration(request.getDuration());
        lesson.setOrderNumber(request.getOrderNumber());
        lesson.setPublished(false);
        lesson.setCreatedAt(LocalDateTime.now());
        lesson.setUpdatedAt(LocalDateTime.now());
        
        Lesson saved = lessonRepository.save(lesson);
        return saved;
    }

    @Override
    public Lesson getLessonById(String lessonId) {
        return lessonRepository.findById(lessonId)
            .orElseThrow(() -> new RuntimeException("Bài học không tìm thấy"));
    }

    @Override
    public List<Lesson> getLessonsByCourse(String courseId) {
        return lessonRepository.findByCourseIdOrderByOrderNumber(courseId);
    }

    @Override
    public Lesson updateLesson(String lessonId, LessonRequest request) {
        Lesson lesson = getLessonById(lessonId);
        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setDuration(request.getDuration());
        lesson.setOrderNumber(request.getOrderNumber());
        lesson.setUpdatedAt(LocalDateTime.now());
        return lessonRepository.save(lesson);
    }

    @Override
    public void publishLesson(String lessonId) {
        Lesson lesson = getLessonById(lessonId);
        lesson.setPublished(true);
        lessonRepository.save(lesson);
    }

    @Override
    public void unpublishLesson(String lessonId) {
        Lesson lesson = getLessonById(lessonId);
        lesson.setPublished(false);
        lessonRepository.save(lesson);
    }

    @Override
    public void deleteLesson(String lessonId) {
        lessonRepository.deleteById(lessonId);
    }

    @Override
    public LessonResponse toResponse(Lesson lesson) {
        return new LessonResponse(
            lesson.getId(),
            lesson.getCourseId(),
            lesson.getTitle(),
            lesson.getDescription(),
            lesson.getVideoUrl(),
            lesson.getDuration(),
            lesson.getOrderNumber(),
            lesson.isPublished(),
            lesson.getCreatedAt(),
            lesson.getUpdatedAt()
        );
    }
}