package com.cms.service;

import com.cms.dto.UserRequest;
import com.cms.dto.UserResponse;
import com.cms.model.User;
import com.cms.model.UserRole;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User saveUser(User user);
    User registerUser(UserRequest request);
    List<User> getAllUsers();
    User getUserById(String userId);
    Optional<User> getUserByUsername(String username);
    Optional<User> getUserByEmail(String email);
    List<User> getUsersByRole(UserRole role);
    User createUserByAdmin(UserRequest request);
    User updateUserByAdmin(String userId, UserRequest request);
    void deleteUser(String userId);
    User updateUser(String userId, UserRequest request);
    void changePassword(String userId, String oldPassword, String newPassword);
    void assignRole(String userId, UserRole role);
    void activateUser(String userId);
    void deactivateUser(String userId);
    UserResponse toResponse(User user);
}