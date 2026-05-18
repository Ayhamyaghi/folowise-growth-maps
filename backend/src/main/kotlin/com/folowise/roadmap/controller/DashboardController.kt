package com.folowise.roadmap.controller

import com.folowise.roadmap.dto.dashboard.ManagerDashboardResponse
import com.folowise.roadmap.dto.dashboard.TraineeDashboardResponse
import com.folowise.roadmap.security.UserPrincipal
import com.folowise.roadmap.service.DashboardService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/dashboard")
class DashboardController(
    private val dashboardService: DashboardService
) {

    @GetMapping("/manager")
    fun getManagerDashboard(): ResponseEntity<ManagerDashboardResponse> =
        ResponseEntity.ok(dashboardService.getManagerDashboard())

    @GetMapping("/trainee")
    fun getTraineeDashboard(
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<TraineeDashboardResponse> =
        ResponseEntity.ok(dashboardService.getTraineeDashboard(principal))
}
