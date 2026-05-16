package com.folowise.roadmap.controller

import com.folowise.roadmap.dto.roadmap.RoadmapTreeResponse
import com.folowise.roadmap.service.RoadmapQueryService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/roadmaps")
class RoadmapController(
    private val roadmapQueryService: RoadmapQueryService
) {

    @GetMapping("/{roadmapId}/tree")
    fun getRoadmapTree(@PathVariable roadmapId: UUID): ResponseEntity<RoadmapTreeResponse> =
        ResponseEntity.ok(roadmapQueryService.getRoadmapTree(roadmapId))
}
