package com.cms.controller;

import com.cms.dto.LoginRequest;
import com.cms.dto.LoginResponse;
import com.cms.dto.UserRequest;
import com.cms.dto.UserResponse;
import com.cms.model.User;
import com.cms.security.JwtUtil;
import com.cms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/register")
    public UserResponse register(@RequestBody UserRequest request) {
        User user = userService.registerUser(request);
        return userService.toResponse(user);
    }

    @PostMapping("/login")
public LoginResponse login(@RequestBody LoginRequest request) {
    System.out.println("=== LOGIN START ===");
    System.out.println("username: " + request.getUsername());
    System.out.println("password: " + request.getPassword());

    User user = userService.getUserByUsername(request.getUsername())
            .orElseThrow(() -> {
                System.out.println("USER NOT FOUND");
                return new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác");
            });

    System.out.println("USER FOUND: " + user.getUsername());
    System.out.println("DB PASSWORD: " + user.getPassword());
    System.out.println("ACTIVE: " + user.isActive());

    boolean matched = passwordEncoder.matches(request.getPassword(), user.getPassword());
    System.out.println("PASSWORD MATCHED: " + matched);

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
    return ResponseEntity.ok("Reset xong");
}

private void resetOne(String username, String rawPassword) {
    userService.getUserByUsername(username).ifPresent(user -> {
        user.setPassword(passwordEncoder.encode(rawPassword));
        userService.saveUser(user);
    });
}
    @PostMapping("/login-email")
    public LoginResponse loginWithEmail(@RequestBody LoginRequest request) {
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
}