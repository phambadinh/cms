package com.cms.service.impl;

import com.cms.model.PasswordResetToken;
import com.cms.model.User;
import com.cms.repository.PasswordResetTokenRepository;
import com.cms.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import java.time.Instant;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetService {
    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;
    private final AuthEmailTemplateService authEmailTemplateService;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    public PasswordResetService(PasswordResetTokenRepository tokenRepository,
                                UserRepository userRepository,
                                JavaMailSender mailSender,
                                                                PasswordEncoder passwordEncoder,
                                                                AuthEmailTemplateService authEmailTemplateService) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
            this.authEmailTemplateService = authEmailTemplateService;
    }

    public boolean createAndSendResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return true;
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        long expiresAt = Instant.now().plusSeconds(3600).toEpochMilli();

        PasswordResetToken prt = new PasswordResetToken();
        prt.setToken(token);
        prt.setUserId(user.getId());
        prt.setExpiresAt(expiresAt);
        tokenRepository.save(prt);

        tokenRepository.findAll().stream()
                .filter(existing -> existing.getUserId() != null && existing.getUserId().equals(user.getId()) && !existing.getToken().equals(token))
                .forEach(tokenRepository::delete);

        String recipientEmail = user.getEmail();
        if (recipientEmail == null || recipientEmail.isBlank()) {
            tokenRepository.delete(prt);
            return false;
        }

        String resetLink = String.format("%s/reset-password?token=%s", frontendUrl, token);
        String emailHtml = authEmailTemplateService.buildResetPasswordHtml(resetLink);
        String emailText = authEmailTemplateService.buildResetPasswordText(resetLink);

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(Objects.requireNonNull(recipientEmail, "recipient email must not be null"));
            helper.setSubject("[CMS] Yêu cầu đặt lại mật khẩu");
            if (mailFrom != null && !mailFrom.isBlank()) {
                helper.setFrom(Objects.requireNonNull(mailFrom, "mail from must not be null"));
            }
            helper.setText(Objects.requireNonNull(emailText, "nội dung email đặt lại mật khẩu không được null"), Objects.requireNonNull(emailHtml, "html email đặt lại mật khẩu không được null"));

            mailSender.send(mimeMessage);
            System.out.println("Đã gửi email đặt lại mật khẩu tới: " + recipientEmail);
            return true;
        } catch (Exception e) {
            System.err.println("Không thể gửi email đặt lại mật khẩu: " + e.getMessage());
            tokenRepository.delete(prt);
            return false;
        }
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return false;
        }

        PasswordResetToken prt = tokenOpt.get();
        if (prt.getExpiresAt() < Instant.now().toEpochMilli()) {
            tokenRepository.delete(prt);
            return false;
        }

        String userId = prt.getUserId();
                if (userId == null) {
                        return false;
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(prt);
        return true;
    }
}
