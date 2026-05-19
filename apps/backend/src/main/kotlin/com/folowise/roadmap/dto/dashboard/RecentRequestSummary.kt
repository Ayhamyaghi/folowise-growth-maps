package com.folowise.roadmap.dto.dashboard

import java.time.OffsetDateTime
import java.util.UUID

data class RecentRequestSummary(
    val id: UUID,
    val action: String,
    val status: String,
    val proposedTitle: String?,
    val description: String,
    val createdAt: OffsetDateTime
)
