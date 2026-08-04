package com.cms.dto;

import com.cms.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private UserRole role; // Default: STUDENT
    private String profileImage;
    private String bio;
    private Boolean active;
}