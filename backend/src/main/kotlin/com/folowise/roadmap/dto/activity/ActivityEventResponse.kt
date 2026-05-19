package com.folowise.roadmap.dto.activity

import java.time.OffsetDateTime
import java.util.UUID

data class ActivityEventResponse(
    val id: UUID,
    val eventType: String,
    val summary: String,
    val actorName: String?,
    val createdAt: OffsetDateTime
)
