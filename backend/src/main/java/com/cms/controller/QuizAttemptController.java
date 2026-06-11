package com.cms.controller;

import com.cms.dto.QuizAttemptRequest;
import com.cms.dto.QuizAttemptResponse;
import com.cms.model.Quiz;
import com.cms.service.QuizAttemptService;
import com.cms.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/quiz-attempts")
public class QuizAttemptController {
    @Autowired
    private QuizAttemptService quizAttemptService;
    
    @Autowired
    private QuizService quizService;

    // STUDENT: Nộp bài quiz
    @PostMapping("/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public QuizAttemptResponse submitQuiz(
            @RequestBody QuizAttemptRequest request,
            Authentication authentication) {
        String userId = authentication.getName();
        
        // Get courseId from quiz
        Quiz quiz = quizService.getQuizById(request.getQuizId());
        String courseId = quiz.getCourseId();
        
        return quizAttemptService.submitQuizAttempt(userId, courseId, request);
    }

    // STUDENT: Lấy các lần làm bài của học sinh
    @GetMapping("/my-attempts")
    @PreAuthorize("hasRole('STUDENT')")
    public List<QuizAttemptResponse> getMyAttempts(Authentication authentication) {
        String userId = authentication.getName();
        return quizAttemptService.getUserAttempts(userId)
            .stream()
            .map(quizAttemptService::toResponse)
            .toList();
    }

    // MENTOR/ADMIN: Lấy các lần làm bài của học sinh cho một quiz
    @GetMapping("/quiz/{quizId}/user/{userId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public List<QuizAttemptResponse> getQuizAttempts(
            @PathVariable String quizId,
            @PathVariable String userId) {
        return quizAttemptService.getQuizAttempts(quizId, userId)
            .stream()
            .map(quizAttemptService::toResponse)
            .toList();
    }

    // MENTOR/ADMIN: Lấy tất cả các lần làm bài cho một khóa học
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public List<QuizAttemptResponse> getCourseAttempts(@PathVariable String courseId) {
        return quizAttemptService.getCourseAttempts(courseId)
            .stream()
            .map(quizAttemptService::toResponse)
            .toList();
    }
}
