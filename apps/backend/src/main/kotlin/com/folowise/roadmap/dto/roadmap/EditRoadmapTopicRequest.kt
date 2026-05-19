package com.folowise.roadmap.dto.roadmap

import jakarta.validation.constraints.NotBlank

data class EditRoadmapTopicRequest(
    @field:NotBlank(message = "Title must not be blank")
    val title: String,
    val description: String? = null,
    val countable: Boolean
)
