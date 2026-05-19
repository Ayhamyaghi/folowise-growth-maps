package com.folowise.roadmap.controller

import com.folowise.roadmap.dto.resource.AddResourceRequest
import com.folowise.roadmap.dto.roadmap.RoadmapTreeResponse
import com.folowise.roadmap.security.UserPrincipal
import com.folowise.roadmap.service.TopicResourceService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/roadmaps/{roadmapId}/topics/{topicId}/resources")
class TopicResourceController(
    private val topicResourceService: TopicResourceService
) {

    @PostMapping
    fun addResource(
        @PathVariable roadmapId: UUID,
        @PathVariable topicId: UUID,
        @Valid @RequestBody request: AddResourceRequest,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(topicResourceService.addResource(roadmapId, topicId, request, principal))

    @DeleteMapping("/{resourceId}")
    fun deleteResource(
        @PathVariable roadmapId: UUID,
        @PathVariable topicId: UUID,
        @PathVariable resourceId: UUID
    ): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.ok(topicResourceService.deleteResource(roadmapId, topicId, resourceId))
}
