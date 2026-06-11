package com.cms.controller;

import com.cms.dto.UserRequest;
import com.cms.dto.UserResponse;
import com.cms.model.User;
import com.cms.model.UserRole;
import com.cms.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ADMIN: Get all users by role
    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public java.util.List<UserResponse> getUsersByRole(@PathVariable String role) {
        UserRole userRole = UserRole.valueOf(role.toUpperCase());
        return userService.getUsersByRole(userRole)
            .stream()
            .map(userService::toResponse)
            .toList();
    }

    // Get own profile
    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR', 'STUDENT')")
    public UserResponse getProfile(Authentication authentication) {
        String userId = authentication.getName();
        User user = userService.getUserById(userId);
        return userService.toResponse(user);
    }

    // ADMIN: Get all users
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public java.util.List<UserResponse> getAllUsers() {
        return userService.getAllUsers()
            .stream()
            .map(userService::toResponse)
            .toList();
    }

    // ADMIN: Create user
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse createUser(@RequestBody UserRequest request) {
        User user = userService.createUserByAdmin(request);
        return userService.toResponse(user);
    }

    // ADMIN: Update user
    @PutMapping("/admin/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateUser(
            @PathVariable String userId,
            @RequestBody UserRequest request) {
        User user = userService.updateUserByAdmin(userId, request);
        return userService.toResponse(user);
    }

    // ADMIN: Delete user
    @DeleteMapping("/admin/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
    }

    // Update own profile
    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR', 'STUDENT')")
    public UserResponse updateProfile(
            @RequestBody UserRequest request,
            Authentication authentication) {
        String userId = authentication.getName();
        User user = userService.updateUser(userId, request);
        return userService.toResponse(user);
    }

    // ADMIN: Assign role to user
    @PostMapping("/{userId}/assign-role")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse assignRole(
            @PathVariable String userId,
            @RequestParam String role) {
        UserRole userRole = UserRole.valueOf(role.toUpperCase());
        userService.assignRole(userId, userRole);
        return userService.toResponse(userService.getUserById(userId));
    }

    // ADMIN: Activate user
    @PostMapping("/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public void activateUser(@PathVariable String userId) {
        userService.activateUser(userId);
    }

    // ADMIN: Deactivate user
    @PostMapping("/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public void deactivateUser(@PathVariable String userId) {
        userService.deactivateUser(userId);
    }
}