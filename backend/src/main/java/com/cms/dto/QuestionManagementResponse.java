package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionManagementResponse {
    private String id;
    private String questionText;
    private List<String> options;
    private Integer correctAnswerIndex;
    private Integer orderNumber;
    private String explanation;
}