package com.folowise.roadmap.dto.roadmap

import jakarta.validation.constraints.NotBlank
import java.util.UUID

data class AddRoadmapTopicRequest(
    @field:NotBlank(message = "Title must not be blank")
    val title: String,
    val description: String? = null,
    val parentId: UUID? = null,
    val countable: Boolean = true
)
