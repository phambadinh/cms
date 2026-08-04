package com.cms.service;

import com.cms.dto.QuestionRequest;
import com.cms.dto.QuestionResponse;
import com.cms.model.Question;
import com.cms.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;

    public Question createQuestion(String quizId, QuestionRequest request) {
        Question question = new Question();
        question.setQuizId(quizId);
        question.setQuestionText(request.getQuestionText());
        question.setOptions(request.getOptions());
        question.setCorrectAnswerIndex(request.getCorrectAnswerIndex());
        question.setOrderNumber(request.getOrderNumber());
        question.setExplanation(request.getExplanation());
        question.setCreatedAt(LocalDateTime.now());
        return questionRepository.save(question);
    }

    public List<Question> getQuestionsByQuizId(String quizId) {
        return questionRepository.findByQuizId(quizId)
            .stream()
            .sorted((q1, q2) -> Integer.compare(q1.getOrderNumber(), q2.getOrderNumber()))
            .collect(Collectors.toList());
    }
    @SuppressWarnings("null")
    public Question updateQuestion(String questionId, QuestionRequest request) {
        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("Câu hỏi không tìm thấy"));
        question.setQuestionText(request.getQuestionText());
        question.setOptions(request.getOptions());
        question.setCorrectAnswerIndex(request.getCorrectAnswerIndex());
        question.setOrderNumber(request.getOrderNumber());
        question.setExplanation(request.getExplanation());
        return questionRepository.save(question);
    }
    @SuppressWarnings("null")
    public void deleteQuestion(String questionId) {
        questionRepository.deleteById(questionId);
    }

    public QuestionResponse toResponse(Question question) {
        return new QuestionResponse(
            question.getId(),
            question.getQuestionText(),
            question.getOptions(),
            question.getOrderNumber(),
            question.getExplanation()
        );
    }
}
