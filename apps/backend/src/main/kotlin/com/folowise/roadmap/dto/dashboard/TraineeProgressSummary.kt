package com.folowise.roadmap.dto.dashboard

import java.time.OffsetDateTime
import java.util.UUID

data class TraineeProgressSummary(
    val traineeId: UUID,
    val traineeName: String,
    val traineeEmail: String,
    val avatarUrl: String?,
    val roadmapId: UUID?,
    val roadmapTitle: String?,
    val progressPercentage: Double,
    val completedCount: Int,
    val totalCount: Int,
    val attentionReason: String?,
    val lastUpdated: OffsetDateTime?
)
