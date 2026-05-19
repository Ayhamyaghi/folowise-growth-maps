package com.folowise.roadmap.controller

import com.folowise.roadmap.dto.changerequest.ChangeRequestResponse
import com.folowise.roadmap.dto.changerequest.RejectChangeRequestRequest
import com.folowise.roadmap.security.UserPrincipal
import com.folowise.roadmap.service.ChangeRequestService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/change-requests")
class ChangeRequestController(
    private val changeRequestService: ChangeRequestService
) {

    @GetMapping("/pending")
    fun getPendingRequests(): ResponseEntity<List<ChangeRequestResponse>> =
        ResponseEntity.ok(changeRequestService.getPendingRequests())

    @GetMapping("/my")
    fun getMyRequests(
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<List<ChangeRequestResponse>> =
        ResponseEntity.ok(changeRequestService.getMyRequests(principal))

    @PostMapping("/{requestId}/approve")
    fun approveRequest(
        @PathVariable requestId: UUID,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<ChangeRequestResponse> =
        ResponseEntity.ok(changeRequestService.approveRequest(requestId, principal))

    @PostMapping("/{requestId}/reject")
    fun rejectRequest(
        @PathVariable requestId: UUID,
        @RequestBody(required = false) request: RejectChangeRequestRequest?,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<ChangeRequestResponse> =
        ResponseEntity.ok(changeRequestService.rejectRequest(requestId, request ?: RejectChangeRequestRequest(), principal))
}
