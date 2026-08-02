package com.cms.service;

import com.cms.dto.PaymentCompleteRequest;
import com.cms.model.PaymentMethod;

public interface PaymentService {
    String initiatePayment(String userId, String courseId, PaymentMethod paymentMethod);
    void completePayment(String userId, PaymentCompleteRequest request);
}
