package com.cms.service;

import com.cms.model.PaymentMethod;

public interface PaymentService {
    String initiatePayment(String userId, String courseId, PaymentMethod paymentMethod);
}
