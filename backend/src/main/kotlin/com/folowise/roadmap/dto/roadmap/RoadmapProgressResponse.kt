package com.folowise.roadmap.dto.roadmap

data class RoadmapProgressResponse(
    val completedCount: Int,
    val totalCount: Int,
    val percentage: Double
)
