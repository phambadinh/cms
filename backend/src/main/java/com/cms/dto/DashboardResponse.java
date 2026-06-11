package com.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private String role;
    private String title;
    private String subtitle;
    private List<DashboardStat> stats;
    private List<InsightChart> charts;
    private List<CourseItem> courses;
    private List<MentorItem> mentors;
    private List<EnrollmentItem> enrollments;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStat {
        private String label;
        private String value;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InsightChart {
        private String title;
        private String subtitle;
        private String type;
        private List<InsightItem> items;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InsightItem {
        private String label;
        private Double value;
        private Double percentage;
        private String color;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseItem {
        private String id;
        private String name;
        private String courseType;
        private boolean published;
        private Integer enrollmentCount;
        private Integer viewCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MentorItem {
        private String id;
        private String name;
        private Integer courseCount;
        private Integer enrollmentCount;
        private Integer viewCount;
        private Integer publishedCourseCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EnrollmentItem {
        private String id;
        private String userId;
        private String userName;
        private String courseId;
        private String courseName;
        private String status;
        private Double progressPercentage;
        private String paymentStatus;
        private LocalDateTime enrolledAt;
    }
}