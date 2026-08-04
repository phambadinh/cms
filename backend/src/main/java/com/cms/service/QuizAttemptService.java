package com.cms.service;

import com.cms.dto.QuizAttemptRequest;
import com.cms.dto.QuizAttemptResponse;
import com.cms.model.Question;
import com.cms.model.QuizAttempt;
import com.cms.repository.QuizAttemptRepository;
import com.cms.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizAttemptService {
    @Autowired
    private QuizAttemptRepository quizAttemptRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private QuizService quizService;

    public QuizAttemptResponse submitQuizAttempt(String userId, String courseId, QuizAttemptRequest request) {
        List<Question> questions = questionRepository.findByQuizId(request.getQuizId())
            .stream()
            .sorted((q1, q2) -> Integer.compare(q1.getOrderNumber(), q2.getOrderNumber()))
            .collect(Collectors.toList());
        
        // Tính điểm
        int score = 0;
        List<Integer> selectedAnswers = request.getSelectedAnswers();
        
        for (int i = 0; i < questions.size() && i < selectedAnswers.size(); i++) {
            if (selectedAnswers.get(i) != null && 
                selectedAnswers.get(i).equals(questions.get(i).getCorrectAnswerIndex())) {
                score++;
            }
        }

        // Kiểm tra đạt hay không đạt
        int totalQuestions = questions.size();
        var quiz = quizService.getQuizById(request.getQuizId());
        int scorePercentage = totalQuestions > 0 ? (score * 100) / totalQuestions : 0;
        boolean passed = scorePercentage >= quiz.getPassingScore();

        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuizId(request.getQuizId());
        attempt.setUserId(userId);
        attempt.setCourseId(courseId);
        attempt.setScore(score);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setSelectedAnswers(selectedAnswers);
        attempt.setPassed(passed);
        attempt.setAttemptedAt(LocalDateTime.now());
        attempt.setDurationSeconds(request.getDurationSeconds());

        QuizAttempt saved = quizAttemptRepository.save(attempt);
        return toResponse(saved);
    }

    public List<QuizAttempt> getUserAttempts(String userId) {
        return quizAttemptRepository.findByUserId(userId);
    }

    public List<QuizAttempt> getQuizAttempts(String quizId, String userId) {
        return quizAttemptRepository.findByUserIdAndQuizId(userId, quizId);
    }

    public List<QuizAttempt> getCourseAttempts(String courseId) {
        return quizAttemptRepository.findByCourseId(courseId);
    }

    public QuizAttemptResponse toResponse(QuizAttempt attempt) {
        double scorePercentage = attempt.getTotalQuestions() > 0 ? 
            (attempt.getScore() * 100.0) / attempt.getTotalQuestions() : 0.0;
        return new QuizAttemptResponse(
            attempt.getId(),
            attempt.getQuizId(),
            attempt.getScore(),
            attempt.getTotalQuestions(),
            attempt.isPassed(),
            attempt.getAttemptedAt(),
            attempt.getDurationSeconds(),
            Math.round(scorePercentage * 100.0) / 100.0
        );
    }
}
