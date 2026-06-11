package com.cms.service.impl;

import com.cms.dto.UserRequest;
import com.cms.dto.UserResponse;
import com.cms.model.User;
import com.cms.model.UserRole;
import com.cms.repository.UserRepository;
import com.cms.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

    private String nowString() {
        return LocalDateTime.now().format(FORMATTER);
    }

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User registerUser(UserRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng");
        }
    

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(request.getRole() != null ? request.getRole() : UserRole.STUDENT);
        user.setProfileImage(request.getProfileImage());
        user.setBio(request.getBio());
        user.setActive(request.getActive() == null || request.getActive());
        user.setCreatedAt(nowString()); 
        user.setUpdatedAt(nowString()); 

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(String userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Người dùng không tìm thấy"));
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    @Override
    public User createUserByAdmin(UserRequest request) {
        return registerUser(request);
    }

    @Override
    public User updateUserByAdmin(String userId, UserRequest request) {
        User user = getUserById(userId);

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail());
        }
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        user.setUpdatedAt(nowString());
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public User updateUser(String userId, UserRequest request) {
        User user = getUserById(userId);
        user.setFullName(request.getFullName());
        user.setProfileImage(request.getProfileImage());
        user.setBio(request.getBio());
        user.setUpdatedAt(nowString()); 
        return userRepository.save(user);
    }

    @Override
    public void changePassword(String userId, String oldPassword, String newPassword) {
        User user = getUserById(userId);
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(nowString());
        userRepository.save(user);
    }

    @Override
    public void assignRole(String userId, UserRole role) {
        User user = getUserById(userId);
        user.setRole(role);
        user.setUpdatedAt(nowString());
        userRepository.save(user);
    }

    @Override
    public void activateUser(String userId) {
        User user = getUserById(userId);
        user.setActive(true);
        user.setUpdatedAt(nowString());
        userRepository.save(user);
    }

    @Override
    public void deactivateUser(String userId) {
        User user = getUserById(userId);
        user.setActive(false);
        user.setUpdatedAt(nowString());
        userRepository.save(user);
    }
    @Override
    public User saveUser(User user) {
    return userRepository.save(user);
    }
    @Override
    public UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFullName(),
            user.getRole(),
            user.getProfileImage(),
            user.getBio(),
            user.isActive(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}