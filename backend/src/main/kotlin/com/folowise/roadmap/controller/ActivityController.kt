package com.folowise.roadmap.controller

import com.folowise.roadmap.dto.activity.ActivityEventResponse
import com.folowise.roadmap.security.UserPrincipal
import com.folowise.roadmap.service.ActivityService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/activity")
class ActivityController(
    private val activityService: ActivityService
) {

    @GetMapping
    fun listEvents(
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<List<ActivityEventResponse>> =
        ResponseEntity.ok(activityService.listEvents(principal))
}
