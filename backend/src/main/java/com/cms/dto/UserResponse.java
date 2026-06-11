package com.cms.dto;

import com.cms.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String username;
    private String email;
    private String fullName;
    private UserRole role;
    private String profileImage;
    private String bio;
    private boolean active;
    private String createdAt;
    private String updatedAt;
}

