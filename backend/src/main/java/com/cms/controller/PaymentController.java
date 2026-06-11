package com.cms.controller;

import com.cms.dto.PaymentInitiateRequest;
import com.cms.dto.PaymentInitiateResponse;
import com.cms.model.PaymentMethod;
import com.cms.service.PaymentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/initiate")
    @PreAuthorize("hasRole('STUDENT')")
    public PaymentInitiateResponse initiatePayment(
            @RequestBody PaymentInitiateRequest request,
            Authentication authentication) {
        String userId = authentication.getName();
        PaymentMethod method = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
        String paymentUrl = paymentService.initiatePayment(userId, request.getCourseId(), method);
        return new PaymentInitiateResponse(paymentUrl, "Chuyển đến cổng thanh toán " + method.name());
    }
}
