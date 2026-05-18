package com.folowise.roadmap.dto.changerequest

import java.util.UUID

data class SubmitMoveTopicRequest(
    val topicId: UUID,
    val newParentId: UUID? = null
)
