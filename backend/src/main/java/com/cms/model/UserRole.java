package com.cms.model;

public enum UserRole {
    ADMIN("ROLE_ADMIN"),
    MENTOR("ROLE_MENTOR"),
    STUDENT("ROLE_STUDENT");

    private final String roleValue;

    UserRole(String roleValue) {
        this.roleValue = roleValue;
    }

    public String getRoleValue() {
        return roleValue;
    }
}
