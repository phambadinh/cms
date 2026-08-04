package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCompleteRequest {
    private String courseId;
    private String paymentMethod;
    private String transactionId;
    private String sessionId;
}