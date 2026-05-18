package com.folowise.roadmap.dto.roadmap

import java.util.UUID

data class MoveRoadmapTopicRequest(
    val newParentId: UUID?
)
