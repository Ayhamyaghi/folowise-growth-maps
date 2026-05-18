package com.folowise.roadmap.dto.changerequest

import jakarta.validation.constraints.NotBlank
import java.util.UUID

data class SubmitEditTopicRequest(
    val topicId: UUID,
    @field:NotBlank(message = "Title must not be blank")
    val title: String,
    val description: String? = null,
    val countable: Boolean = true
)
