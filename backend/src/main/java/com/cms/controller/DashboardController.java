package com.cms.controller;

import com.cms.dto.DashboardResponse;
import com.cms.service.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardResponse getAdminDashboard() {
        return dashboardService.getAdminDashboard();
    }

    @GetMapping("/mentor")
    @PreAuthorize("hasAnyRole('MENTOR', 'ADMIN')")
    public DashboardResponse getMentorDashboard(Authentication authentication) {
        return dashboardService.getMentorDashboard(authentication.getName());
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public DashboardResponse getStudentDashboard(Authentication authentication) {
        return dashboardService.getStudentDashboard(authentication.getName());
    }
}