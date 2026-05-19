package com.folowise.roadmap.controller

import com.folowise.roadmap.dto.roadmap.AddRoadmapTopicRequest
import com.folowise.roadmap.dto.roadmap.EditRoadmapTopicRequest
import com.folowise.roadmap.dto.roadmap.MoveRoadmapTopicRequest
import com.folowise.roadmap.dto.roadmap.RoadmapTreeResponse
import com.folowise.roadmap.dto.roadmap.UpdateRoadmapTopicStatusRequest
import com.folowise.roadmap.security.UserPrincipal
import com.folowise.roadmap.service.RoadmapMutationService
import com.folowise.roadmap.service.RoadmapQueryService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/roadmaps")
class RoadmapController(
    private val roadmapQueryService: RoadmapQueryService,
    private val roadmapMutationService: RoadmapMutationService
) {

    @GetMapping("/me/tree")
    fun getMyRoadmapTree(
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.ok(roadmapQueryService.getMyRoadmapTree(principal))

    @GetMapping("/{roadmapId}/tree")
    fun getRoadmapTree(
        @PathVariable roadmapId: UUID,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.ok(roadmapQueryService.getRoadmapTree(roadmapId, principal))

    @PostMapping("/{roadmapId}/topics")
    fun addTopic(
        @PathVariable roadmapId: UUID,
        @Valid @RequestBody request: AddRoadmapTopicRequest,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(roadmapMutationService.addTopic(roadmapId, request, principal))

    @PutMapping("/{roadmapId}/topics/{topicId}")
    fun editTopic(
        @PathVariable roadmapId: UUID,
        @PathVariable topicId: UUID,
        @Valid @RequestBody request: EditRoadmapTopicRequest,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.ok(roadmapMutationService.editTopic(roadmapId, topicId, request, principal))

    @DeleteMapping("/{roadmapId}/topics/{topicId}")
    fun deleteTopic(
        @PathVariable roadmapId: UUID,
        @PathVariable topicId: UUID,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.ok(roadmapMutationService.deleteTopic(roadmapId, topicId, principal))

    @PatchMapping("/{roadmapId}/topics/{topicId}/move")
    fun moveTopic(
        @PathVariable roadmapId: UUID,
        @PathVariable topicId: UUID,
        @RequestBody request: MoveRoadmapTopicRequest,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.ok(roadmapMutationService.moveTopic(roadmapId, topicId, request, principal))

    @PatchMapping("/{roadmapId}/topics/{topicId}/status")
    fun updateTopicStatus(
        @PathVariable roadmapId: UUID,
        @PathVariable topicId: UUID,
        @Valid @RequestBody request: UpdateRoadmapTopicStatusRequest,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.ok(roadmapMutationService.updateTopicStatus(roadmapId, topicId, request, principal))
}
