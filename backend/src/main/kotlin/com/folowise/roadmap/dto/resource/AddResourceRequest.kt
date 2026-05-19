package com.folowise.roadmap.dto.resource

import com.folowise.roadmap.domain.enums.ResourceType
import jakarta.validation.constraints.NotBlank

data class AddResourceRequest(
    @field:NotBlank(message = "Title must not be blank")
    val title: String,
    val resourceType: ResourceType,
    val url: String? = null,
    val note: String? = null
)
