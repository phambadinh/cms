package com.cms.service;

import com.cms.dto.QuizRequest;
import com.cms.dto.QuizResponse;
import com.cms.model.Question;
import com.cms.model.Quiz;
import com.cms.repository.QuizRepository;
import com.cms.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private QuestionService questionService;

    public Quiz createQuiz(QuizRequest request) {
        Quiz quiz = new Quiz();
        quiz.setLessonId(request.getLessonId());
        quiz.setCourseId(request.getCourseId());
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setPassingScore(request.getPassingScore() != null ? request.getPassingScore() : 70);
        quiz.setPublished(false);
        quiz.setCreatedAt(LocalDateTime.now());
        quiz.setUpdatedAt(LocalDateTime.now());
        return quizRepository.save(quiz);
    }

    public Quiz getQuizById(String quizId) {
        return quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz không tìm thấy"));
    }

    public Quiz getQuizByLessonId(String lessonId) {
        return quizRepository.findByLessonId(lessonId)
            .orElseThrow(() -> new RuntimeException("Quiz cho bài học không tìm thấy"));
    }

    public List<Quiz> getQuizzesByCourseId(String courseId) {
        return quizRepository.findByCourseId(courseId);
    }

    public Quiz updateQuiz(String quizId, QuizRequest request) {
        Quiz quiz = getQuizById(quizId);
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setPassingScore(request.getPassingScore());
        quiz.setUpdatedAt(LocalDateTime.now());
        return quizRepository.save(quiz);
    }

    public void publishQuiz(String quizId) {
        Quiz quiz = getQuizById(quizId);
        quiz.setPublished(true);
        quizRepository.save(quiz);
    }

    public void unpublishQuiz(String quizId) {
        Quiz quiz = getQuizById(quizId);
        quiz.setPublished(false);
        quizRepository.save(quiz);
    }

    public void deleteQuiz(String quizId) {
        // Delete all questions first
        List<Question> questions = questionRepository.findByQuizId(quizId);
        questionRepository.deleteAll(questions);
        quizRepository.deleteById(quizId);
    }

    public QuizResponse toResponse(Quiz quiz) {
        List<Question> questions = questionRepository.findByQuizId(quiz.getId());
        List<com.cms.dto.QuestionResponse> questionResponses = questions.stream()
            .sorted((q1, q2) -> Integer.compare(q1.getOrderNumber(), q2.getOrderNumber()))
            .map(questionService::toResponse)
            .collect(Collectors.toList());
        
        return new QuizResponse(
            quiz.getId(),
            quiz.getLessonId(),
            quiz.getCourseId(),
            quiz.getTitle(),
            quiz.getDescription(),
            quiz.getPassingScore(),
            questionResponses,
            quiz.isPublished(),
            quiz.getCreatedAt(),
            quiz.getUpdatedAt()
        );
    }
}
