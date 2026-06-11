package com.cms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "questions")
public class Question {
    @Id
    private String id;
    private String quizId;
    private String questionText;
    private List<String> options; // Các lựa chọn
    private Integer correctAnswerIndex; // Index của đáp án đúng
    private Integer orderNumber;
    private String explanation; // Giải thích cho câu hỏi
    private LocalDateTime createdAt;
}
