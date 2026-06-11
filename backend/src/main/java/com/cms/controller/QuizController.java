package com.cms.controller;

import com.cms.dto.QuizRequest;
import com.cms.dto.QuestionRequest;
import com.cms.dto.QuestionResponse;
import com.cms.dto.QuizResponse;
import com.cms.service.QuizService;
import com.cms.service.QuestionService;
import com.cms.model.Question;
import com.cms.model.Quiz;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    @Autowired
    private QuizService quizService;
    @Autowired
    private QuestionService questionService;

    // MENTOR/ADMIN: Tạo quiz cho bài học
    @PostMapping
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public QuizResponse createQuiz(@RequestBody QuizRequest request) {
        Quiz quiz = quizService.createQuiz(request);
        return quizService.toResponse(quiz);
    }

    // STUDENT: Lấy quiz của bài học (để trả lời)
    @GetMapping("/lesson/{lessonId}")
    @PreAuthorize("hasRole('STUDENT')")
    public QuizResponse getQuizByLessonId(@PathVariable String lessonId) {
        Quiz quiz = quizService.getQuizByLessonId(lessonId);
        return quizService.toResponse(quiz);
    }

    // MENTOR/ADMIN: Lấy chi tiết quiz
    @GetMapping("/{quizId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public QuizResponse getQuiz(@PathVariable String quizId) {
        Quiz quiz = quizService.getQuizById(quizId);
        return quizService.toResponse(quiz);
    }

    // MENTOR/ADMIN: Cập nhật quiz
    @PutMapping("/{quizId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public QuizResponse updateQuiz(@PathVariable String quizId, @RequestBody QuizRequest request) {
        Quiz quiz = quizService.updateQuiz(quizId, request);
        return quizService.toResponse(quiz);
    }

    // MENTOR/ADMIN: Công bố quiz
    @PostMapping("/{quizId}/publish")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public void publishQuiz(@PathVariable String quizId) {
        quizService.publishQuiz(quizId);
    }

    // MENTOR/ADMIN: Hủy công bố quiz
    @PostMapping("/{quizId}/unpublish")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public void unpublishQuiz(@PathVariable String quizId) {
        quizService.unpublishQuiz(quizId);
    }

    // MENTOR/ADMIN: Xóa quiz
    @DeleteMapping("/{quizId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public void deleteQuiz(@PathVariable String quizId) {
        quizService.deleteQuiz(quizId);
    }

    // MENTOR/ADMIN: Lấy các câu hỏi của quiz
    @GetMapping("/{quizId}/questions")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public List<QuestionResponse> getQuestions(@PathVariable String quizId) {
        return questionService.getQuestionsByQuizId(quizId)
            .stream()
            .map(questionService::toResponse)
            .toList();
    }

    // MENTOR/ADMIN: Thêm câu hỏi vào quiz
    @PostMapping("/{quizId}/questions")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public QuestionResponse addQuestion(@PathVariable String quizId, @RequestBody QuestionRequest request) {
        Question question = questionService.createQuestion(quizId, request);
        return questionService.toResponse(question);
    }

    // MENTOR/ADMIN: Cập nhật câu hỏi
    @PutMapping("/questions/{questionId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public QuestionResponse updateQuestion(@PathVariable String questionId, @RequestBody QuestionRequest request) {
        Question question = questionService.updateQuestion(questionId, request);
        return questionService.toResponse(question);
    }

    // MENTOR/ADMIN: Xóa câu hỏi
    @DeleteMapping("/questions/{questionId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public void deleteQuestion(@PathVariable String questionId) {
        questionService.deleteQuestion(questionId);
    }

    // STUDENT: Lấy quiz để làm (không hiển thị đáp án)
    @GetMapping("/{quizId}/for-student")
    @PreAuthorize("hasRole('STUDENT')")
    public QuizResponse getQuizForStudent(@PathVariable String quizId) {
        Quiz quiz = quizService.getQuizById(quizId);
        return quizService.toResponse(quiz);
    }
}
