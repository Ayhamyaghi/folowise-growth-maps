package com.folowise.roadmap.dto.trainee

import java.time.OffsetDateTime
import java.util.UUID

data class TraineeListItemResponse(
    val traineeId: UUID,
    val traineeName: String,
    val traineeEmail: String,
    val avatarUrl: String?,
    val specialization: String,
    val roadmapId: UUID?,
    val roadmapTitle: String?,
    val roadmapStatus: String?,
    val progressPercentage: Double,
    val completedCount: Int,
    val totalCount: Int,
    val activeTopic: String?,
    val lastUpdated: OffsetDateTime?,
    val attentionReason: String?
)
