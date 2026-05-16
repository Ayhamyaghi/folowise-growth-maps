package com.folowise.roadmap.dto.roadmap

import java.util.UUID

data class RoadmapTopicNodeResponse(
    val id: UUID,
    val parentId: UUID?,
    val title: String,
    val description: String?,
    val status: String,
    val countable: Boolean,
    val displayOrder: Int,
    val children: List<RoadmapTopicNodeResponse>
)
