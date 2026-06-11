package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
    private String id;
    private String questionText;
    private List<String> options;
    private Integer orderNumber;
    private String explanation;
    // Note: correctAnswerIndex is not sent to client (hidden for students)
}
