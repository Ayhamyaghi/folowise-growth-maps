package com.folowise.roadmap.dto.changerequest

import java.time.OffsetDateTime
import java.util.UUID

data class ChangeRequestResponse(
    val id: UUID,
    val roadmapId: UUID,
    val roadmapTitle: String,
    val action: String,
    val status: String,
    val description: String,
    val requestedByEmail: String,
    val requestedByDisplayName: String,
    val proposedTitle: String?,
    val proposedDescription: String?,
    val proposedParentId: UUID?,
    val proposedParentTitle: String?,
    val proposedCountable: Boolean,
    val proposedStatus: String?,
    val managerNote: String?,
    val createdAt: OffsetDateTime
)
