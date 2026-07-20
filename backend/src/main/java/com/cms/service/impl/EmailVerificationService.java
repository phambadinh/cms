package com.cms.service.impl;

import com.cms.model.EmailVerificationToken;
import com.cms.model.User;
import com.cms.repository.EmailVerificationTokenRepository;
import com.cms.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import java.time.Instant;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailVerificationService {
    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final AuthEmailTemplateService authEmailTemplateService;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    public EmailVerificationService(EmailVerificationTokenRepository tokenRepository,
                                    UserRepository userRepository,
                                    JavaMailSender mailSender,
                                    AuthEmailTemplateService authEmailTemplateService) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.authEmailTemplateService = authEmailTemplateService;
    }

    public boolean sendVerificationEmail(User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return false;
        }

        String token = UUID.randomUUID().toString();
        long expiresAt = Instant.now().plusSeconds(24 * 3600).toEpochMilli();

        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUserId(user.getId());
        verificationToken.setExpiresAt(expiresAt);
        tokenRepository.save(verificationToken);

        tokenRepository.findAll().stream()
                .filter(existing -> existing.getUserId() != null && existing.getUserId().equals(user.getId()) && !existing.getToken().equals(token))
                .forEach(tokenRepository::delete);

        String verifyLink = String.format("%s/verify-email?token=%s", frontendUrl, token);
        String html = authEmailTemplateService.buildVerificationHtml(verifyLink, user.getFullName(), user.getEmail());
        String text = authEmailTemplateService.buildVerificationText(verifyLink, user.getFullName(), user.getEmail());

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(Objects.requireNonNull(user.getEmail(), "user email must not be null"));
            helper.setSubject("[CMS] Xác minh email tài khoản");
            if (mailFrom != null && !mailFrom.isBlank()) {
                helper.setFrom(Objects.requireNonNull(mailFrom, "mail from must not be null"));
            }
            helper.setText(Objects.requireNonNull(text, "verification text must not be null"), Objects.requireNonNull(html, "verification html must not be null"));

            mailSender.send(mimeMessage);
            return true;
        } catch (Exception e) {
            tokenRepository.delete(verificationToken);
            System.err.println("Failed to send verification email: " + e.getMessage());
            return false;
        }
    }

    public boolean verifyEmail(String token) {
        Optional<EmailVerificationToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return false;
        }

        EmailVerificationToken verificationToken = tokenOpt.get();
        if (verificationToken.getUsedAt() != null || verificationToken.getExpiresAt() < Instant.now().toEpochMilli()) {
            tokenRepository.delete(verificationToken);
            return false;
        }

        String userId = verificationToken.getUserId();
        if (userId == null) {
            tokenRepository.delete(verificationToken);
            return false;
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            tokenRepository.delete(verificationToken);
            return false;
        }

        User user = userOpt.get();
        user.setActive(true);
        user.setUpdatedAt(Instant.now().toString());
        userRepository.save(user);

        verificationToken.setUsedAt(Instant.now().toEpochMilli());
        tokenRepository.save(verificationToken);
        return true;
    }

    public boolean resendVerificationEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return true;
        }

        User user = userOpt.get();
        if (user.isActive()) {
            return true;
        }

        return sendVerificationEmail(user);
    }
}
