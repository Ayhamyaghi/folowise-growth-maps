package com.folowise.roadmap.controller

import com.folowise.roadmap.dto.changerequest.ChangeRequestResponse
import com.folowise.roadmap.dto.changerequest.SubmitAddTopicRequest
import com.folowise.roadmap.dto.changerequest.SubmitDeleteTopicRequest
import com.folowise.roadmap.dto.changerequest.SubmitEditTopicRequest
import com.folowise.roadmap.dto.changerequest.SubmitMoveTopicRequest
import com.folowise.roadmap.security.UserPrincipal
import com.folowise.roadmap.service.ChangeRequestService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/roadmaps")
class RoadmapChangeRequestController(
    private val changeRequestService: ChangeRequestService
) {

    @PostMapping("/{roadmapId}/change-requests/add-topic")
    fun submitAddTopicRequest(
        @PathVariable roadmapId: UUID,
        @Valid @RequestBody request: SubmitAddTopicRequest,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<ChangeRequestResponse> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(changeRequestService.submitAddTopicRequest(roadmapId, request, principal))

    @PostMapping("/{roadmapId}/change-requests/edit-topic")
    fun submitEditTopicRequest(
        @PathVariable roadmapId: UUID,
        @Valid @RequestBody request: SubmitEditTopicRequest,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<ChangeRequestResponse> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(changeRequestService.submitEditTopicRequest(roadmapId, request, principal))

    @PostMapping("/{roadmapId}/change-requests/delete-topic")
    fun submitDeleteTopicRequest(
        @PathVariable roadmapId: UUID,
        @RequestBody request: SubmitDeleteTopicRequest,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<ChangeRequestResponse> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(changeRequestService.submitDeleteTopicRequest(roadmapId, request, principal))

    @PostMapping("/{roadmapId}/change-requests/move-topic")
    fun submitMoveTopicRequest(
        @PathVariable roadmapId: UUID,
        @RequestBody request: SubmitMoveTopicRequest,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<ChangeRequestResponse> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(changeRequestService.submitMoveTopicRequest(roadmapId, request, principal))
}
