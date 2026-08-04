package com.cms.service;

import com.cms.dto.LessonProgressResponse;
import com.cms.model.LessonProgress;
import com.cms.repository.LessonProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class LessonProgressService {
    @Autowired
    private LessonProgressRepository progressRepository;

    public LessonProgress startLesson(String userId, String lessonId, String courseId) {
        Optional<LessonProgress> existing = progressRepository.findByUserIdAndLessonId(userId, lessonId);
        
        if (existing.isPresent()) {
            return existing.get();
        }

        LessonProgress progress = new LessonProgress();
        progress.setUserId(userId);
        progress.setLessonId(lessonId);
        progress.setCourseId(courseId);
        progress.setCompleted(false);
        progress.setWatchedDuration(0.0);
        progress.setStartedAt(LocalDateTime.now());
        
        return progressRepository.save(progress);
    }

    public LessonProgress updateProgress(String userId, String lessonId, Double watchedDuration) {
        LessonProgress progress = progressRepository.findByUserIdAndLessonId(userId, lessonId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy tiến độ bài học"));
        
        progress.setWatchedDuration(watchedDuration);
        return progressRepository.save(progress);
    }

    public LessonProgress completeLesson(String userId, String lessonId) {
        LessonProgress progress = progressRepository.findByUserIdAndLessonId(userId, lessonId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy tiến độ bài học"));
        
        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        return progressRepository.save(progress);
    }

    public LessonProgress getProgress(String userId, String lessonId) {
        return progressRepository.findByUserIdAndLessonId(userId, lessonId)
            .orElse(null);
    }

    public LessonProgressResponse toResponse(LessonProgress progress) {
        if (progress == null) {
            return null;
        }
        return new LessonProgressResponse(
            progress.getId(),
            progress.getUserId(),
            progress.getLessonId(),
            progress.getCourseId(),
            progress.isCompleted(),
            progress.getWatchedDuration(),
            progress.getStartedAt(),
            progress.getCompletedAt()
        );
    }
}
