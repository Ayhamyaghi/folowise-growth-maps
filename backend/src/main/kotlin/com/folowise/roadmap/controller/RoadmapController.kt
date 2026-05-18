package com.folowise.roadmap.controller

import com.folowise.roadmap.dto.roadmap.AddRoadmapTopicRequest
import com.folowise.roadmap.dto.roadmap.EditRoadmapTopicRequest
import com.folowise.roadmap.dto.roadmap.RoadmapTreeResponse
import com.folowise.roadmap.service.RoadmapMutationService
import com.folowise.roadmap.service.RoadmapQueryService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
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

    @GetMapping("/{roadmapId}/tree")
    fun getRoadmapTree(@PathVariable roadmapId: UUID): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.ok(roadmapQueryService.getRoadmapTree(roadmapId))

    @PostMapping("/{roadmapId}/topics")
    fun addTopic(
        @PathVariable roadmapId: UUID,
        @Valid @RequestBody request: AddRoadmapTopicRequest
    ): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(roadmapMutationService.addTopic(roadmapId, request))

    @PutMapping("/{roadmapId}/topics/{topicId}")
    fun editTopic(
        @PathVariable roadmapId: UUID,
        @PathVariable topicId: UUID,
        @Valid @RequestBody request: EditRoadmapTopicRequest
    ): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.ok(roadmapMutationService.editTopic(roadmapId, topicId, request))

    @DeleteMapping("/{roadmapId}/topics/{topicId}")
    fun deleteTopic(
        @PathVariable roadmapId: UUID,
        @PathVariable topicId: UUID
    ): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.ok(roadmapMutationService.deleteTopic(roadmapId, topicId))
}
