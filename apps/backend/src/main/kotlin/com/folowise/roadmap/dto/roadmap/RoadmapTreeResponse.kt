package com.folowise.roadmap.dto.roadmap

import java.util.UUID

data class RoadmapTreeResponse(
    val roadmapId: UUID,
    val title: String,
    val description: String?,
    val status: String,
    val progress: RoadmapProgressResponse,
    val topics: List<RoadmapTopicNodeResponse>,
    val traineeId: UUID? = null,
    val traineeName: String? = null,
    val traineeAvatarUrl: String? = null,
    val traineeSpecialization: String? = null
)
