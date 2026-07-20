package com.cms.controller;

import com.cms.dto.LoginRequest;
import com.cms.dto.LoginResponse;
import com.cms.service.impl.EmailVerificationService;
import com.cms.dto.UserRequest;
import com.cms.model.User;
import com.cms.security.JwtUtil;
import com.cms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.cms.service.impl.PasswordResetService;
import com.cms.dto.ForgotPasswordRequest;
import com.cms.dto.ResetPasswordRequest;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequest request) {
        User user = userService.registerUser(request);
        boolean sent = emailVerificationService.sendVerificationEmail(user);
        return ResponseEntity.ok(java.util.Map.of(
                "message", sent
                        ? "Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản."
                        : "Đăng ký thành công nhưng chưa gửi được email xác minh. Vui lòng thử gửi lại sau.",
                "user", userService.toResponse(user)
        ));
    }

    @PostMapping("/login")
public LoginResponse login(@RequestBody LoginRequest request) {
    String identifier = request.getUsername();

    if (identifier == null || identifier.isBlank() || request.getPassword() == null || request.getPassword().isBlank()) {
        throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác");
    }

    User user;
    if (identifier != null && identifier.contains("@")) {
        user = userService.getUserByEmail(identifier)
                .orElseThrow(() -> {
                    return new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác");
                });
    } else {
        user = userService.getUserByUsername(identifier)
                .orElseThrow(() -> {
                    return new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác");
                });
    }

    boolean matched = passwordEncoder.matches(request.getPassword(), user.getPassword());

    if (!matched) {
        throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác");
    }

    if (!user.isActive()) {
        throw new RuntimeException("Tài khoản đã bị vô hiệu hóa");
    }

    String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole().name());
    return new LoginResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getFullName(), user.getRole());
}
    @PostMapping("/dev/reset-passwords")
public ResponseEntity<String> resetPasswords() {
    resetOne("admin", "admin123");
    resetOne("mentor", "password");
    resetOne("student", "password");
    return ResponseEntity.ok("Đã đặt lại mật khẩu xong");
}

private void resetOne(String username, String rawPassword) {
    userService.getUserByUsername(username).ifPresent(user -> {
        user.setPassword(passwordEncoder.encode(rawPassword));
        userService.saveUser(user);
    });
}
    @PostMapping("/login-email")
    public LoginResponse loginWithEmail(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank() || request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác");
        }

        User user = userService.getUserByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Tài khoản đã bị vô hiệu hóa");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole().name());

        return new LoginResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        // Tạo token và gửi email mà không trả lại liên kết đặt lại trong phản hồi API.
        boolean sent = passwordResetService.createAndSendResetToken(request.getEmail());

        if (!sent) {
            return ResponseEntity.status(500).body(java.util.Map.of(
                "message", "Không thể gửi email đặt lại mật khẩu. Vui lòng kiểm tra cấu hình SMTP.",
                "email", request.getEmail()
            ));
        }

        return ResponseEntity.ok().body(java.util.Map.of(
                "message", "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu",
                "email", request.getEmail()
        ));
    }

        @GetMapping("/verify-email")
        public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        boolean ok = emailVerificationService.verifyEmail(token);
        if (!ok) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                "message", "Link xác minh không hợp lệ hoặc đã hết hạn"
            ));
        }

        return ResponseEntity.ok().body(java.util.Map.of(
            "message", "Xác minh email thành công. Bạn có thể đăng nhập ngay bây giờ."
        ));
        }

        @PostMapping("/resend-verification")
        public ResponseEntity<?> resendVerification(@RequestBody ForgotPasswordRequest request) {
        boolean sent = emailVerificationService.resendVerificationEmail(request.getEmail());
        return ResponseEntity.ok().body(java.util.Map.of(
            "message", sent
                ? "Đã gửi lại email xác minh. Vui lòng kiểm tra hộp thư của bạn."
                : "Không thể gửi lại email xác minh lúc này.",
            "email", request.getEmail()
        ));
        }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean ok = passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        if (!ok) {
            return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn");
        }
        return ResponseEntity.ok("Đặt lại mật khẩu thành công");
    }
}