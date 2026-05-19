package com.folowise.roadmap.dto.roadmap

import com.folowise.roadmap.domain.enums.TopicStatus
import jakarta.validation.constraints.NotNull

data class UpdateRoadmapTopicStatusRequest(
    @field:NotNull(message = "Status must not be null")
    val status: TopicStatus
)
