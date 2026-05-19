package com.folowise.roadmap.dto.dashboard

import java.util.UUID

data class PendingRequestSummary(
    val id: UUID,
    val requestedByDisplayName: String,
    val action: String,
    val proposedTitle: String?,
    val description: String
)
