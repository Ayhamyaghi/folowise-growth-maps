package com.folowise.roadmap.dto.changerequest

import com.folowise.roadmap.domain.enums.TopicStatus
import jakarta.validation.constraints.NotNull
import java.util.UUID

data class SubmitStatusChangeRequest(
    @field:NotNull(message = "Topic ID must not be null")
    val topicId: UUID,

    @field:NotNull(message = "Status must not be null")
    val status: TopicStatus
)
