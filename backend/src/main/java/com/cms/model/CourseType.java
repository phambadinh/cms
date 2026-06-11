package com.cms.model;

public enum CourseType {
    FREE("Khóa học miễn phí"),
    PREMIUM("Khóa học trả phí");

    private final String displayName;

    CourseType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
