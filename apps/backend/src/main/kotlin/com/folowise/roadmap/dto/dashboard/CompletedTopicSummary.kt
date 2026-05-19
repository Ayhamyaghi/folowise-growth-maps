package com.folowise.roadmap.dto.dashboard

import java.time.OffsetDateTime
import java.util.UUID

data class CompletedTopicSummary(
    val id: UUID,
    val title: String,
    val completedAt: OffsetDateTime?
)
