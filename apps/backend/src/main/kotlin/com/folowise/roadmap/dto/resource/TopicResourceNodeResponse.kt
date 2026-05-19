package com.folowise.roadmap.dto.resource

import java.util.UUID

data class TopicResourceNodeResponse(
    val id: UUID,
    val title: String,
    val resourceType: String,
    val url: String?,
    val note: String?,
    val addedByName: String
)
